package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"stocky/models"
	"stocky/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BannerHandler struct {
	Service *services.BannerService
}

func NewBannerHandler(service *services.BannerService) *BannerHandler {
	return &BannerHandler{Service: service}
}

func parseBannerID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID banner tidak valid",
		})
		return 0, false
	}

	return uint(id), true
}

func (h *BannerHandler) GetAllPublic(c *gin.Context) {
	banners, err := h.Service.GetAllPublic()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil banner",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banners})
}

func (h *BannerHandler) GetPublicByID(c *gin.Context) {
	id, ok := parseBannerID(c)
	if !ok {
		return
	}

	banner, err := h.Service.GetPublicByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "banner tidak ditemukan atau tidak sedang berlaku",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil banner",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

func (h *BannerHandler) GetAllAdmin(c *gin.Context) {
	banners, err := h.Service.GetAllAdmin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil semua banner",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banners})
}

func (h *BannerHandler) GetByID(c *gin.Context) {
	id, ok := parseBannerID(c)
	if !ok {
		return
	}

	banner, err := h.Service.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "banner tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil banner",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": banner})
}

func (h *BannerHandler) Create(c *gin.Context) {
	var input models.Banner

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "request JSON tidak valid",
		})
		return
	}

	if err := h.Service.Create(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "banner berhasil dibuat",
		"data":    input,
	})
}

func (h *BannerHandler) Update(c *gin.Context) {
	id, ok := parseBannerID(c)
	if !ok {
		return
	}

	var input models.Banner

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "request JSON tidak valid",
		})
		return
	}

	if err := h.Service.Update(id, &input); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "banner tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	banner, err := h.Service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "banner berhasil di-update, tetapi gagal mengambil data terbaru",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "banner berhasil di-update",
		"data":    banner,
	})
}

func (h *BannerHandler) Delete(c *gin.Context) {
	id, ok := parseBannerID(c)
	if !ok {
		return
	}

	if err := h.Service.Delete(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "banner tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal menghapus banner",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "banner berhasil dihapus",
	})
}