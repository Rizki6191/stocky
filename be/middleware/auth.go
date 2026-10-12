package middleware

import (
	"net/http"
	"strconv"
	"strings"

	"stocky/services"

	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	Service *services.AuthService
}

func NewAuthMiddleware(service *services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{Service: service}
}

func (m *AuthMiddleware) Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		parts := strings.Fields(header)

		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "access token wajib disertakan",
			})
			return
		}

		claims, err := m.Service.ValidateAccessToken(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "access token tidak valid atau kedaluwarsa",
			})
			return
		}

		if claims.Role != "user" && claims.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "role tidak valid",
			})
			return
		}

		if !strings.HasPrefix(claims.Subject, "user:") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "subject token tidak valid",
			})
			return
		}

		id, err := strconv.ParseUint(
			strings.TrimPrefix(claims.Subject, "user:"),
			10,
			64,
		)
		if err != nil || id == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "identitas token tidak valid",
			})
			return
		}

		c.Set("userID", uint(id))
		c.Set("role", claims.Role)
		c.Next()
	}
}

func (m *AuthMiddleware) RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists || userRole != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "kamu tidak memiliki izin untuk mengakses resource ini",
			})
			return
		}

		c.Next()
	}
}