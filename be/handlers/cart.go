package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"stocky/services"

	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	service *services.CartService
}

func NewCartHandler(service *services.CartService) *CartHandler {
	return &CartHandler{service: service}
}

type addCartItemRequest struct {
	ProductID uint `json:"product_id" binding:"required,gt=0"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

type updateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,gt=0"`
}

// GET /api/cart
func (h *CartHandler) Get(c *gin.Context) {
	userID, ok := getCartUserID(c)
	if !ok {
		return
	}

	cart, err := h.service.GetCart(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve cart",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": cart,
	})
}

// POST /api/cart/items
func (h *CartHandler) AddItem(c *gin.Context) {
	userID, ok := getCartUserID(c)
	if !ok {
		return
	}

	var req addCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "product_id and a positive quantity are required",
		})
		return
	}

	err := h.service.AddItem(userID, req.ProductID, req.Quantity)
	if err != nil {
		h.handleCartError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "item added to cart",
	})
}

// PUT /api/cart/items/:id
func (h *CartHandler) UpdateItem(c *gin.Context) {
	userID, ok := getCartUserID(c)
	if !ok {
		return
	}

	itemID, ok := parseCartItemID(c)
	if !ok {
		return
	}

	var req updateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "a positive quantity is required",
		})
		return
	}

	if err := h.service.UpdateItem(userID, itemID, req.Quantity); err != nil {
		h.handleCartError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "cart item updated",
	})
}

// DELETE /api/cart/items/:id
func (h *CartHandler) RemoveItem(c *gin.Context) {
	userID, ok := getCartUserID(c)
	if !ok {
		return
	}

	itemID, ok := parseCartItemID(c)
	if !ok {
		return
	}

	if err := h.service.RemoveItem(userID, itemID); err != nil {
		h.handleCartError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "item removed from cart",
	})
}

// DELETE /api/cart
func (h *CartHandler) Clear(c *gin.Context) {
	userID, ok := getCartUserID(c)
	if !ok {
		return
	}

	if err := h.service.ClearCart(userID); err != nil {
		h.handleCartError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "cart cleared",
	})
}

func getCartUserID(c *gin.Context) (uint, bool) {
	value, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return 0, false
	}

	userID, ok := value.(uint)
	if !ok || userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid authenticated user",
		})
		return 0, false
	}

	return userID, true
}

func parseCartItemID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid cart item id",
		})
		return 0, false
	}

	return uint(id), true
}

func (h *CartHandler) handleCartError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, services.ErrCartInvalidInput):
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid cart input",
		})

	case errors.Is(err, services.ErrCartProductNotFound):
		c.JSON(http.StatusNotFound, gin.H{
			"error": "product not found",
		})

	case errors.Is(err, services.ErrCartItemNotFound):
		c.JSON(http.StatusNotFound, gin.H{
			"error": "cart item not found",
		})

	case errors.Is(err, services.ErrCartInsufficientStock):
		c.JSON(http.StatusConflict, gin.H{
			"error": "insufficient product stock",
		})

	case errors.Is(err, services.ErrCartProductInactive):
		c.JSON(http.StatusConflict, gin.H{
			"error": "product is inactive",
		})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
	}
}
