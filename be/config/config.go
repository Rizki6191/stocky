package config

import (
	"os"
	"time"

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
	JWTSecret string
	JWTAccessTTL time.Duration
	JWTRefreshTTL time.Duration
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
		JWTSecret: getEnv("JWT_SECRET", ""),
		JWTAccessTTL: getDurationEnv("JWT_ACCESS_TTL", 15*time.Minute),
		JWTRefreshTTL: getDurationEnv("JWT_REFRESH_TTL", 7*24*time.Hour),
	}
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	value := os.Getenv(key)
	if value == "" {
		return  fallback
	}

	duration, err := time.ParseDuration(value)
	if err != nil || duration <= 0{
		return  fallback
	}

	return duration
}