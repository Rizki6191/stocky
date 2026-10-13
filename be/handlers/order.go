package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"stocky/services"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	service *services.OrderService
}

func NewOrderHandler(service *services.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

// POST /api/orders/checkout
func (h *OrderHandler) Checkout(c *gin.Context) {
	userID, ok := getOrderUserID(c)
	if !ok {
		return
	}

	order, err := h.service.Checkout(userID)
	if err != nil {
		h.handleOrderError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "order created successfully",
		"data":    order,
	})
}

// GET /api/orders
func (h *OrderHandler) GetMyOrders(c *gin.Context) {
	userID, ok := getOrderUserID(c)
	if !ok {
		return
	}

	orders, err := h.service.GetMyOrders(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve orders",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": orders,
	})
}

// GET /api/orders/:id
func (h *OrderHandler) GetMyOrder(c *gin.Context) {
	userID, ok := getOrderUserID(c)
	if !ok {
		return
	}

	orderID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || orderID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order id",
		})
		return
	}

	order, err := h.service.GetMyOrder(userID, uint(orderID))
	if err != nil {
		h.handleOrderError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": order,
	})
}

func getOrderUserID(c *gin.Context) (uint, bool) {
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

func (h *OrderHandler) handleOrderError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, services.ErrOrderInvalidInput):
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order input",
		})

	case errors.Is(err, services.ErrOrderCartEmpty):
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "cart is empty",
		})

	case errors.Is(err, services.ErrOrderNotFound):
		c.JSON(http.StatusNotFound, gin.H{
			"error": "order or product not found",
		})

	case errors.Is(err, services.ErrOrderProductInactive):
		c.JSON(http.StatusConflict, gin.H{
			"error": "a product in the cart is inactive",
		})

	case errors.Is(err, services.ErrOrderInsufficientStock):
		c.JSON(http.StatusConflict, gin.H{
			"error": "insufficient product stock",
		})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to process order",
		})
	}
}
