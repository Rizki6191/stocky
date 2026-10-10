package routes

import (
	"stocky/handlers"
	"stocky/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(router *gin.Engine, db *gorm.DB) {
	// Services
	productService := services.NewProductService(db)
	categoryService := services.NewCategoryService(db)
	bannerService := services.NewBannerService(db)

	// Handlers
	productHandler := handlers.NewProductHandler(productService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	bannerHandler := handlers.NewBannerHandler(bannerService)

	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "API is running",
		})
	})

	api := router.Group("/api")
	{
		// PUBLIC: Products
		api.GET("/products", productHandler.GetAll)
		api.GET("/products/:id", productHandler.GetByID)

		// PUBLIC: Categories
		api.GET("/categories", categoryHandler.GetAll)
		api.GET("/categories/:id", categoryHandler.GetByID)

		// PUBLIC: Banners yang sedang berlaku
		api.GET("/banners", bannerHandler.GetAllPublic)
		api.GET("/banners/:id", bannerHandler.GetPublicByID)

		// ADMIN
		admin := api.Group("/admin")
		{
			// Products
			admin.POST("/products", productHandler.Create)
			admin.PUT("/products/:id", productHandler.Update)
			admin.DELETE("/products/:id", productHandler.Delete)

			// Categories
			admin.POST("/categories", categoryHandler.Create)
			admin.PUT("/categories/:id", categoryHandler.Update)
			admin.DELETE("/categories/:id", categoryHandler.Delete)

			// Banners
			admin.GET("/banners", bannerHandler.GetAllAdmin)
			admin.GET("/banners/:id", bannerHandler.GetByID)
			admin.POST("/banners", bannerHandler.Create)
			admin.PUT("/banners/:id", bannerHandler.Update)
			admin.DELETE("/banners/:id", bannerHandler.Delete)
		}
	}
}