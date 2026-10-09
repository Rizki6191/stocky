package routes

import (
	"stocky/handlers"
	"stocky/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(
	router *gin.Engine,
	db *gorm.DB,
) {
	// Services
	productService := services.NewProductService(db)
	categoryService := services.NewCategoryService(db)

	// Handlers
	productHandler := handlers.NewProductHandler(productService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)

	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "API is running",
		})	
	})

	// API
	api := router.Group("/api")
	{
		// =========================
		// PUBLIC
		// =========================

		api.GET("/products", productHandler.GetAll)
		api.GET("/products/:id", productHandler.GetByID)

		api.GET("/categories", categoryHandler.GetAll)
		api.GET("/categories/:id", categoryHandler.GetByID)

		// =========================
		// PRIVATE (ADMIN)
		// =========================

		admin := api.Group("/admin")
		{
			admin.POST("/products", productHandler.Create)
			admin.PUT("/products/:id", productHandler.Update)
			admin.DELETE("/products/:id", productHandler.Delete)

			admin.POST("/categories", categoryHandler.Create)
			admin.PUT("/categories/:id", categoryHandler.Update)
			admin.DELETE("/categories/:id", categoryHandler.Delete)
		}
	}
}