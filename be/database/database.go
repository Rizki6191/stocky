package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"stocky/config"
	"stocky/models"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	dsn := cfg.DatabaseURL

	// Jika DATABASE_URL belum tersedia,
	// gunakan konfigurasi PostgreSQL lokal.
	if dsn == "" {
		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			cfg.DBHost,
			cfg.DBPort,
			cfg.DBUser,
			cfg.DBPassword,
			cfg.DBName,
			cfg.DBSSLMode,
		)

		log.Println("Menggunakan PostgreSQL lokal")
	} else {
		log.Println("Menggunakan DATABASE_URL")
	}

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("gagal koneksi database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan database instance: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("gagal ping database: %w", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.ProductImage{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
		&models.Promo{},
		&models.Banner{},
	)
	if err != nil {
		return nil, fmt.Errorf("gagal auto migrate database: %w", err)
	}

	log.Println("Database PostgreSQL terhubung!")

	return db, nil
}
