package services

import (
	"errors"
	"strings"

	"stocky/models"

	"gorm.io/gorm"
)

type CategoryService struct {
	DB *gorm.DB
}

func NewCategoryService(db *gorm.DB) *CategoryService {
	return &CategoryService{
		DB: db,
	}
}

func (s *CategoryService) GetAll() ([]models.Category, error) {
	var categories []models.Category

	err := s.DB.
		Order("name ASC").
		Find(&categories).Error

	return categories, err
}

func (s *CategoryService) GetByID(id uint) (*models.Category, error) {
	var category models.Category

	err := s.DB.
		Preload("Products").
		First(&category, id).Error

	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (s *CategoryService) Create(category *models.Category) error {
	category.Name = strings.TrimSpace(category.Name)

	if category.Name == "" {
		return errors.New("nama category wajib diisi")
	}

	return s.DB.Create(category).Error
}

func (s *CategoryService) Update(id uint, input *models.Category) error {
	var category models.Category

	if err := s.DB.First(&category, id).Error; err != nil {
		return err
	}

	input.Name = strings.TrimSpace(input.Name)

	if input.Name == "" {
		return errors.New("nama category wajib diisi")
	}

	category.Name = input.Name
	category.Description = input.Description

	return s.DB.Save(&category).Error
}

func (s *CategoryService) Delete(id uint) error {
	var category models.Category

	if err := s.DB.First(&category, id).Error; err != nil {
		return err
	}

	var count int64

	if err := s.DB.
		Model(&models.Product{}).
		Where("category_id = ?", id).
		Count(&count).Error; err != nil {
		return err
	}

	if count > 0 {
		return errors.New("category masih digunakan oleh product")
	}

	return s.DB.Delete(&category).Error
}