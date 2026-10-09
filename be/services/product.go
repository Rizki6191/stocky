package services

import (
	"errors"
	"strings"

	"stocky/models"

	"gorm.io/gorm"
)

type ProductService struct {
	DB *gorm.DB
}

func NewProductService(db *gorm.DB) *ProductService {
	return &ProductService{
		DB: db,
	}
}

func (s *ProductService) GetAll() ([]models.Product, error) {
	var products []models.Product

	err := s.DB.
		Preload("Category").
		Preload("Images").
		Where("is_active = ?", true).
		Order("created_at DESC").
		Find(&products).Error

	return products, err
}

func (s *ProductService) GetByID(id uint) (*models.Product, error) {
	var product models.Product

	err := s.DB.
		Preload("Category").
		Preload("Images").
		First(&product, id).Error

	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *ProductService) Create(product *models.Product) error {
	product.Name = strings.TrimSpace(product.Name)
	product.Description = strings.TrimSpace(product.Description)

	if product.Name == "" {
		return errors.New("nama product wajib diisi")
	}

	if product.Description == "" {
		return errors.New("description wajib diisi")
	}

	if product.Price < 0 {
		return errors.New("harga tidak boleh negatif")
	}

	if product.Stock < 0 {
		return errors.New("stock tidak boleh negatif")
	}

	var category models.Category

	if err := s.DB.First(&category, product.CategoryID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("category tidak ditemukan")
		}

		return err
	}

	return s.DB.Create(product).Error
}

func (s *ProductService) Update(id uint, input *models.Product) error {
	var product models.Product

	if err := s.DB.First(&product, id).Error; err != nil {
		return err
	}

	input.Name = strings.TrimSpace(input.Name)
	input.Description = strings.TrimSpace(input.Description)

	if input.Name == "" {
		return errors.New("nama product wajib diisi")
	}

	if input.Description == "" {
		return errors.New("description wajib diisi")
	}

	if input.Price < 0 {
		return errors.New("harga tidak boleh negatif")
	}

	if input.Stock < 0 {
		return errors.New("stock tidak boleh negatif")
	}

	if input.CategoryID != 0 {
		var category models.Category

		if err := s.DB.First(&category, input.CategoryID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errors.New("category tidak ditemukan")
			}

			return err
		}

		product.CategoryID = input.CategoryID
	}

	product.Name = input.Name
	product.Description = input.Description
	product.Price = input.Price
	product.Stock = input.Stock
	product.IsActive = input.IsActive

	return s.DB.Save(&product).Error
}

func (s *ProductService) Delete(id uint) error {
	var product models.Product

	if err := s.DB.First(&product, id).Error; err != nil {
		return err
	}

	return s.DB.Delete(&product).Error
}