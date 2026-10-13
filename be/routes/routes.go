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
	cartService := services.NewCartService(db)
	orderService := services.NewOrderService(db)

	// Handlers
	productHandler := handlers.NewProductHandler(productService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	bannerHandler := handlers.NewBannerHandler(bannerService)
	authHandler := handlers.NewAuthHandler(authService)
	cartHandler := handlers.NewCartHandler(cartService)
	orderHandler := handlers.NewOrderHandler(orderService)

	// Middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Health check
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

			auth.GET(
				"/me",
				authMiddleware.Authenticate(),
				authHandler.Me,
			)
			auth.PUT(
				"/me",
				authMiddleware.Authenticate(),
				authHandler.UpdateProfile,
			)
			auth.PUT(
				"/password",
				authMiddleware.Authenticate(),
				authHandler.ChangePassword,
			)
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

		// CART: Semua endpoint wajib login.
		cart := api.Group("/cart", authMiddleware.Authenticate())
		{
			cart.GET("", cartHandler.Get)
			cart.POST("/items", cartHandler.AddItem)
			cart.PUT("/items/:id", cartHandler.UpdateItem)
			cart.DELETE("/items/:id", cartHandler.RemoveItem)
			cart.DELETE("", cartHandler.Clear)
		}

		// ORDERS: Semua endpoint wajib login.
		orders := api.Group("/orders", authMiddleware.Authenticate())
		{
			orders.POST("/checkout", orderHandler.Checkout)
			orders.GET("", orderHandler.GetMyOrders)
			orders.GET("/:id", orderHandler.GetMyOrder)
		}

		// ADMIN: Login dan role admin wajib.
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
