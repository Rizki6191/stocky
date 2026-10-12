package routes

import (
	"stocky/config"
	"stocky/handlers"
	"stocky/middleware"
	"stocky/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(router *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// Services
	productService := services.NewProductService(db)
	categoryService := services.NewCategoryService(db)
	bannerService := services.NewBannerService(db)
	authService := services.NewAuthService(
		db,
		cfg.JWTSecret,
		cfg.JWTAccessTTL,
		cfg.JWTRefreshTTL,
	)

	// Handlers
	productHandler := handlers.NewProductHandler(productService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	bannerHandler := handlers.NewBannerHandler(bannerService)
	authHandler := handlers.NewAuthHandler(authService)

	// Middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "API is running",
		})
	})

	api := router.Group("/api")
	{
		// AUTH
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.Refresh)
			auth.POST("/logout", authHandler.Logout)

			// Endpoint untuk mendapatkan profil pengguna yang login.
			auth.GET("/me", authMiddleware.Authenticate(), authHandler.Me)
		}

		// PUBLIC: Products
		api.GET("/products", productHandler.GetAll)
		api.GET("/products/:id", productHandler.GetByID)

		// PUBLIC: Categories
		api.GET("/categories", categoryHandler.GetAll)
		api.GET("/categories/:id", categoryHandler.GetByID)

		// PUBLIC: Banners
		api.GET("/banners", bannerHandler.GetAllPublic)
		api.GET("/banners/:id", bannerHandler.GetPublicByID)

		// ADMIN: Semua route di grup ini wajib login sebagai admin.
		admin := api.Group(
			"/admin",
			authMiddleware.Authenticate(),
			authMiddleware.RequireRole("admin"),
		)
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
