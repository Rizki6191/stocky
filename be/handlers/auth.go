package handlers

import (
	"errors"
	"net/http"
	"strings"

	"stocky/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthHandler struct {
	Service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{Service: service}
}

type registerRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type loginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type UpdateProfileRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8,max=72"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input registerRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "name, email, dan password wajib diisi",
		})
		return
	}

	user, tokens, err := h.Service.Register(
		input.Name,
		input.Email,
		input.Password,
	)
	if err != nil {
		if errors.Is(err, services.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if strings.Contains(err.Error(), "email sudah terdaftar") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mendaftarkan akun",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "registrasi berhasil",
		"user":    user,
		"tokens":  tokens,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input loginRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "email dan password wajib diisi",
		})
		return
	}

	user, tokens, err := h.Service.Login(input.Email, input.Password)
	if err != nil {
		if errors.Is(err, services.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "email atau password salah",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal melakukan login",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "login berhasil",
		"user":    user,
		"tokens":  tokens,
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var input refreshRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "refresh_token wajib diisi",
		})
		return
	}

	tokens, err := h.Service.Refresh(input.RefreshToken)
	if err != nil {
		if errors.Is(err, services.ErrInvalidRefresh) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "refresh token tidak valid atau kedaluwarsa",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal memperbarui token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "token berhasil diperbarui",
		"tokens":  tokens,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	var input refreshRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "refresh_token wajib diisi",
		})
		return
	}

	err := h.Service.Logout(input.RefreshToken)
	if err != nil {
		if errors.Is(err, services.ErrInvalidRefresh) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "refresh token tidak valid atau sudah dicabut",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal logout",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "logout berhasil",
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "belum login"})
		return
	}

	user, err := h.Service.GetUserByID(userID.(uint))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "akun tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil profil",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}	


func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "autentikasi diperlukan",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "identitas pengguna tidak valid",
		})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "nama dan email yang valid wajib diisi",
		})
		return
	}

	user, err := h.Service.UpdateProfile(userID, req.Name, req.Email)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		case errors.Is(err, services.ErrEmailExists):
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "pengguna tidak ditemukan"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal memperbarui profil"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "profil berhasil diperbarui",
		"user":    user,
	})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "autentikasi diperlukan",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "identitas pengguna tidak valid",
		})
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "current_password dan new_password wajib diisi; password baru minimal 8 karakter",
		})
		return
	}

	if req.CurrentPassword == req.NewPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "password baru harus berbeda dari password lama",
		})
		return
	}

	err := h.Service.ChangePassword(
		userID,
		req.CurrentPassword,
		req.NewPassword,
	)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrInvalidCredentials):
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "password lama salah",
			})
		case errors.Is(err, services.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "password baru harus 8–72 byte",
			})
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.JSON(http.StatusNotFound, gin.H{
				"error": "pengguna tidak ditemukan",
			})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "gagal mengganti password",
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "password berhasil diganti; silakan login kembali",
	})
}
