package services

import (
	"errors"
	"net/url"
	"strings"
	"time"

	"stocky/models"

	"gorm.io/gorm"
)

type BannerService struct {
	DB *gorm.DB
}

func NewBannerService(db *gorm.DB) *BannerService {
	return &BannerService{DB: db}
}

// GetAllPublic mengambil banner yang aktif dan sedang berlaku.
func (s *BannerService) GetAllPublic() ([]models.Banner, error) {
	var banners []models.Banner
	now := time.Now()

	err := s.DB.
		Where("is_active = ?", true).
		Where("(start_at IS NULL OR start_at <= ?)", now).
		Where("(end_at IS NULL OR end_at >= ?)", now).
		Order("sort_order ASC").
		Order("id DESC").
		Find(&banners).Error

	return banners, err
}

// GetAllAdmin mengambil semua banner, termasuk banner terjadwal.
func (s *BannerService) GetAllAdmin() ([]models.Banner, error) {
	var banners []models.Banner

	err := s.DB.
		Order("sort_order ASC").
		Order("id DESC").
		Find(&banners).Error

	return banners, err
}

// GetPublicByID hanya mengembalikan banner yang sedang berlaku.
func (s *BannerService) GetPublicByID(id uint) (*models.Banner, error) {
	var banner models.Banner
	now := time.Now()

	err := s.DB.
		Where("id = ?", id).
		Where("is_active = ?", true).
		Where("(start_at IS NULL OR start_at <= ?)", now).
		Where("(end_at IS NULL OR end_at >= ?)", now).
		First(&banner).Error

	if err != nil {
		return nil, err
	}

	return &banner, nil
}

func (s *BannerService) GetByID(id uint) (*models.Banner, error) {
	var banner models.Banner

	if err := s.DB.First(&banner, id).Error; err != nil {
		return nil, err
	}

	return &banner, nil
}

func validateBanner(b *models.Banner) error {
	b.Title = strings.TrimSpace(b.Title)
	b.Description = strings.TrimSpace(b.Description)
	b.ImageURL = strings.TrimSpace(b.ImageURL)
	b.LinkURL = strings.TrimSpace(b.LinkURL)
	b.ButtonText = strings.TrimSpace(b.ButtonText)

	if b.Title == "" {
		return errors.New("judul banner wajib diisi")
	}

	if b.ImageURL == "" {
		return errors.New("URL gambar banner wajib diisi")
	}

	imageURL, err := url.ParseRequestURI(b.ImageURL)
	if err != nil ||
		(imageURL.Scheme != "http" && imageURL.Scheme != "https") ||
		imageURL.Host == "" {
		return errors.New("URL gambar harus berupa URL HTTP atau HTTPS yang valid")
	}

	if b.LinkURL != "" {
		linkURL, err := url.ParseRequestURI(b.LinkURL)
		if err != nil ||
			(linkURL.Scheme != "http" && linkURL.Scheme != "https") ||
			linkURL.Host == "" {
			return errors.New("URL tujuan harus berupa URL HTTP atau HTTPS yang valid")
		}
	}

	if b.StartAt != nil && b.EndAt != nil &&
		b.EndAt.Before(*b.StartAt) {
		return errors.New("waktu berakhir tidak boleh sebelum waktu mulai")
	}

	return nil
}

func (s *BannerService) Create(banner *models.Banner) error {
	if err := validateBanner(banner); err != nil {
		return err
	}

	return s.DB.Create(banner).Error
}

func (s *BannerService) Update(id uint, input *models.Banner) error {
	if err := validateBanner(input); err != nil {
		return err
	}

	var banner models.Banner
	if err := s.DB.First(&banner, id).Error; err != nil {
		return err
	}

	// Map memastikan nilai false, 0, dan string kosong tetap dapat di-update.
	updates := map[string]interface{}{
		"title":       input.Title,
		"description": input.Description,
		"image_url":   input.ImageURL,
		"link_url":    input.LinkURL,
		"button_text": input.ButtonText,
		"sort_order":  input.SortOrder,
		"start_at":    input.StartAt,
		"end_at":      input.EndAt,
		"is_active":   input.IsActive,
	}

	return s.DB.Model(&banner).Updates(updates).Error
}

func (s *BannerService) Delete(id uint) error {
	var banner models.Banner

	if err := s.DB.First(&banner, id).Error; err != nil {
		return err
	}

	return s.DB.Delete(&banner).Error
}
