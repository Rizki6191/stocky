package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppPort     string
	AppEnv      string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string
	DatabaseURL string
}

func Load() *Config {
	// Load .env jika tersedia.
	// Environment variable yang sudah ada tetap dapat digunakan.
	_ = godotenv.Load()

	return &Config{
		AppPort: getEnv(
			"APP_PORT",
			"14141",
		),

		AppEnv: getEnv(
			"APP_ENV",
			"development",
		),

		DBHost: getEnv(
			"DB_HOST",
			"localhost",
		),

		DBPort: getEnv(
			"DB_PORT",
			"5432",
		),

		DBUser: getEnv(
			"DB_USER",
			"postgres",
		),

		DBPassword: getEnv(
			"DB_PASSWORD",
			"postgres",
		),

		DBName: getEnv(
			"DB_NAME",
			"stocky",
		),

		DBSSLMode: getEnv(
			"DB_SSLMODE",
			"disable",
		),

		DatabaseURL: getEnv(
			"DATABASE_URL",
			"",
		),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}