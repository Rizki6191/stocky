package services

import (
	"errors"
	"fmt"

	"stocky/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	ErrCartInvalidInput      = errors.New("invalid cart input")
	ErrCartProductNotFound   = errors.New("product not found")
	ErrCartItemNotFound      = errors.New("cart item not found")
	ErrCartInsufficientStock = errors.New("insufficient product stock")
	ErrCartProductInactive   = errors.New("product is inactive")
)

type CartService struct {
	db *gorm.DB
}

func NewCartService(db *gorm.DB) *CartService {
	return &CartService{db: db}
}

type CartItemResponse struct {
	ID          uint   `json:"id"`
	ProductID   uint   `json:"product_id"`
	ProductName string `json:"product_name"`
	Description string `json:"description"`
	Price       int64  `json:"price"`
	Quantity    int    `json:"quantity"`
	Subtotal    int64  `json:"subtotal"`
	Stock       int    `json:"stock"`
	ImageURL    string `json:"image_url,omitempty"`
}

type CartResponse struct {
	ID         uint               `json:"id"`
	Items      []CartItemResponse `json:"items"`
	TotalItems int                `json:"total_items"`
	Total      int64              `json:"total"`
}

func (s *CartService) getOrCreateCart(tx *gorm.DB, userID uint) (models.Cart, error) {
	var cart models.Cart

	err := tx.Where("user_id = ?", userID).
		FirstOrCreate(&cart, models.Cart{UserID: userID}).Error
	if err != nil {
		return models.Cart{}, err
	}

	return cart, nil
}

func (s *CartService) GetCart(userID uint) (*CartResponse, error) {
	if userID == 0 {
		return nil, ErrCartInvalidInput
	}

	var cart models.Cart
	err := s.db.Where("user_id = ?", userID).First(&cart).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return &CartResponse{Items: []CartItemResponse{}}, nil
	}
	if err != nil {
		return nil, err
	}

	var items []models.CartItem
	if err := s.db.
		Where("cart_id = ?", cart.ID).
		Preload("Product").
		Preload("Product.Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("is_primary DESC, sort_order ASC, id ASC")
		}).
		Order("id ASC").
		Find(&items).Error; err != nil {
		return nil, err
	}

	response := &CartResponse{
		ID:    cart.ID,
		Items: make([]CartItemResponse, 0, len(items)),
	}

	for _, item := range items {
		product := item.Product

		var imageURL string
		if len(product.Images) > 0 {
			imageURL = product.Images[0].URL
		}

		subtotal := product.Price * int64(item.Quantity)

		response.Items = append(response.Items, CartItemResponse{
			ID:          item.ID,
			ProductID:   product.ID,
			ProductName: product.Name,
			Description: product.Description,
			Price:       product.Price,
			Quantity:    item.Quantity,
			Subtotal:    subtotal,
			Stock:       product.Stock,
			ImageURL:    imageURL,
		})

		response.TotalItems += item.Quantity
		response.Total += subtotal
	}

	return response, nil
}

func (s *CartService) AddItem(userID, productID uint, quantity int) error {
	if userID == 0 || productID == 0 || quantity <= 0 {
		return ErrCartInvalidInput
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		cart, err := s.getOrCreateCart(tx, userID)
		if err != nil {
			return err
		}

		var product models.Product
		err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			First(&product, productID).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCartProductNotFound
		}
		if err != nil {
			return err
		}

		if !product.IsActive {
			return ErrCartProductInactive
		}

		var item models.CartItem
		err = tx.Where("cart_id = ? AND product_id = ?", cart.ID, product.ID).
			First(&item).Error

		if err == nil {
			if item.Quantity > product.Stock-quantity {
				return ErrCartInsufficientStock
			}

			item.Quantity += quantity
			return tx.Save(&item).Error
		}

		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if quantity > product.Stock {
			return ErrCartInsufficientStock
		}

		item = models.CartItem{
			CartID:    cart.ID,
			ProductID: product.ID,
			Quantity:  quantity,
		}

		return tx.Create(&item).Error
	})
}

func (s *CartService) UpdateItem(userID, itemID uint, quantity int) error {
	if userID == 0 || itemID == 0 || quantity <= 0 {
		return ErrCartInvalidInput
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		var item models.CartItem
		err := tx.
			Joins("JOIN carts ON carts.id = cart_items.cart_id").
			Where("cart_items.id = ? AND carts.user_id = ?", itemID, userID).
			First(&item).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCartItemNotFound
		}
		if err != nil {
			return err
		}

		var product models.Product
		err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			First(&product, item.ProductID).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrCartProductNotFound
		}
		if err != nil {
			return err
		}

		if !product.IsActive {
			return ErrCartProductInactive
		}
		if quantity > product.Stock {
			return ErrCartInsufficientStock
		}

		item.Quantity = quantity
		return tx.Save(&item).Error
	})
}

func (s *CartService) RemoveItem(userID, itemID uint) error {
	if userID == 0 || itemID == 0 {
		return ErrCartInvalidInput
	}

	result := s.db.
		Where(
			"id = ? AND cart_id IN (?)",
			itemID,
			s.db.Model(&models.Cart{}).
				Select("id").
				Where("user_id = ?", userID),
		).
		Delete(&models.CartItem{})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrCartItemNotFound
	}

	return nil
}

func (s *CartService) ClearCart(userID uint) error {
	if userID == 0 {
		return ErrCartInvalidInput
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		var cart models.Cart
		err := tx.Where("user_id = ?", userID).First(&cart).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		if err != nil {
			return err
		}

		if err := tx.Where("cart_id = ?", cart.ID).
			Delete(&models.CartItem{}).Error; err != nil {
			return fmt.Errorf("clear cart: %w", err)
		}

		return nil
	})
}
