
package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"sort"
	"time"

	"stocky/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	ErrOrderInvalidInput = errors.New("invalid order input")
	ErrOrderCartEmpty    = errors.New("cart is empty")
	ErrOrderNotFound     = errors.New("order not found")
	ErrOrderProductInactive = errors.New("product is inactive")
	ErrOrderInsufficientStock = errors.New("insufficient product stock")
)

type OrderService struct {
	db *gorm.DB
}

func NewOrderService(db *gorm.DB) *OrderService {
	return &OrderService{db: db}
}

// Checkout membuat order dari cart milik user yang sedang login.
func (s *OrderService) Checkout(userID uint) (*models.Order, error) {
	if userID == 0 {
		return nil, ErrOrderInvalidInput
	}

	var createdOrder models.Order

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// Ambil cart milik user.
		var cart models.Cart
		if err := tx.
			Where("user_id = ?", userID).
			First(&cart).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrOrderCartEmpty
			}
			return err
		}

		// Kunci baris cart item selama checkout.
		var cartItems []models.CartItem
		if err := tx.
			Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("cart_id = ?", cart.ID).
			Order("product_id ASC").
			Find(&cartItems).Error; err != nil {
			return err
		}

		if len(cartItems) == 0 {
			return ErrOrderCartEmpty
		}

		// Urutkan product ID untuk mengurangi risiko deadlock
		// ketika beberapa checkout berjalan bersamaan.
		sort.Slice(cartItems, func(i, j int) bool {
			return cartItems[i].ProductID < cartItems[j].ProductID
		})

		orderItems := make([]models.OrderItem, 0, len(cartItems))
		var total int64

		for _, cartItem := range cartItems {
			var product models.Product

			err := tx.
				Clauses(clause.Locking{Strength: "UPDATE"}).
				First(&product, cartItem.ProductID).Error

			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrOrderNotFound
			}
			if err != nil {
				return err
			}

			if !product.IsActive {
				return ErrOrderProductInactive
			}

			if cartItem.Quantity <= 0 || cartItem.Quantity > product.Stock {
				return ErrOrderInsufficientStock
			}

			subtotal := product.Price * int64(cartItem.Quantity)
			total += subtotal

			orderItems = append(orderItems, models.OrderItem{
				ProductID:   product.ID,
				ProductName: product.Name,
				Price:       product.Price,
				Quantity:    cartItem.Quantity,
				Subtotal:    subtotal,
			})

			// Kurangi stok di dalam transaksi yang sama.
			result := tx.Model(&models.Product{}).
				Where("id = ? AND stock >= ?", product.ID, cartItem.Quantity).
				Update("stock", gorm.Expr("stock - ?", cartItem.Quantity))

			if result.Error != nil {
				return result.Error
			}
			if result.RowsAffected != 1 {
				return ErrOrderInsufficientStock
			}
		}

		orderNumber, err := generateOrderNumber()
		if err != nil {
			return err
		}

		createdOrder = models.Order{
			UserID:      userID,
			OrderNumber: orderNumber,
			TotalAmount: total,
			Status:      "pending",
			Items:       orderItems,
		}

		if err := tx.Create(&createdOrder).Error; err != nil {
			return err
		}

		// Hapus cart item hanya jika order berhasil dibuat.
		if err := tx.
			Where("cart_id = ?", cart.ID).
			Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Ambil kembali order beserta itemnya.
	var order models.Order
	if err := s.db.
		Preload("Items").
		Where("id = ? AND user_id = ?", createdOrder.ID, userID).
		First(&order).Error; err != nil {
		return nil, err
	}

	return &order, nil
}

// GetMyOrders menampilkan order milik user yang login.
func (s *OrderService) GetMyOrders(userID uint) ([]models.Order, error) {
	if userID == 0 {
		return nil, ErrOrderInvalidInput
	}

	orders := make([]models.Order, 0)

	err := s.db.
		Where("user_id = ?", userID).
		Preload("Items").
		Order("created_at DESC").
		Find(&orders).Error

	if err != nil {
		return nil, err
	}

	return orders, nil
}

// GetMyOrder mengambil satu order milik user yang login.
func (s *OrderService) GetMyOrder(userID, orderID uint) (*models.Order, error) {
	if userID == 0 || orderID == 0 {
		return nil, ErrOrderInvalidInput
	}

	var order models.Order
	err := s.db.
		Where("id = ? AND user_id = ?", orderID, userID).
		Preload("Items").
		First(&order).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrOrderNotFound
	}
	if err != nil {
		return nil, err
	}

	return &order, nil
}

func generateOrderNumber() (string, error) {
	randomBytes := make([]byte, 6)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fmt.Errorf("generate order number: %w", err)
	}

	return fmt.Sprintf(
		"STK-%s-%s",
		time.Now().Format("20060102150405"),
		hex.EncodeToString(randomBytes),
	), nil
}
