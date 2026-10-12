
package main

import (
	"log"

	"stocky/config"
	"stocky/database"
	"stocky/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()

	routes.Setup(router, db, cfg)

	log.Printf("Server running on :%s", cfg.AppPort)

	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
