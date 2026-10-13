
package main

import (
	"log"
	"os"

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

	if len(os.Args) > 1 && os.Args[1] == "seed" {
		if err := database.Seed(); err != nil {
			log.Fatal(err)
		}
		return
	}

	router := gin.Default()

	routes.Setup(router, db, cfg)

	log.Printf("Server running on :%s", cfg.AppPort)

	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
