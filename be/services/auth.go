package services

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"net/mail"
	"strconv"
	"strings"
	"time"

	"stocky/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var (
	ErrInvalidCredentials = errors.New("email atau password salah")
	ErrInvalidRefresh     = errors.New("refresh token tidak valid atau kedaluwarsa")
	ErrInvalidInput       = errors.New("data registrasi tidak valid")
	ErrEmailExists        = errors.New("email sudah terdaftar")
)

type AuthService struct {
	DB         *gorm.DB
	JWTSecret  []byte
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int64  `json:"expires_in"`
}

type AccessClaims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func NewAuthService(
	db *gorm.DB,
	secret string,
	accessTTL time.Duration,
	refreshTTL time.Duration,
) *AuthService {
	return &AuthService{
		DB:         db,
		JWTSecret:  []byte(secret),
		AccessTTL:  accessTTL,
		RefreshTTL: refreshTTL,
	}
}

func (s *AuthService) generateAccessToken(user *models.User) (string, error) {
	now := time.Now()

	claims := AccessClaims{
		Role: user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   "user:" + strconv.FormatUint(uint64(user.ID), 10),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(s.AccessTTL)),
			Issuer:    "stocky",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.JWTSecret)
}

func (s *AuthService) ValidateAccessToken(raw string) (*AccessClaims, error) {
	claims := &AccessClaims{}

	token, err := jwt.ParseWithClaims(
		raw,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, errors.New("algoritma JWT tidak diizinkan")
			}
			return s.JWTSecret, nil
		},
		jwt.WithIssuer("stocky"),
		jwt.WithExpirationRequired(),
		jwt.WithValidMethods([]string{"HS256"}),
	)

	if err != nil || token == nil || !token.Valid {
		return nil, errors.New("access token tidak valid")
	}

	if !strings.HasPrefix(claims.Subject, "user:") {
		return nil, errors.New("subject token tidak valid")
	}

	id, err := strconv.ParseUint(
		strings.TrimPrefix(claims.Subject, "user:"),
		10,
		64,
	)
	if err != nil || id == 0 {
		return nil, errors.New("user ID token tidak valid")
	}

	if claims.Role != "user" && claims.Role != "admin" {
		return nil, errors.New("role token tidak valid")
	}

	return claims, nil
}

func hashRefreshToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return base64.RawURLEncoding.EncodeToString(sum[:])
}

func generateRefreshToken() (string, error) {
	random := make([]byte, 32)

	if _, err := rand.Read(random); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(random), nil
}

func (s *AuthService) issueSession(
	tx *gorm.DB,
	user *models.User,
) (*TokenPair, error) {
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateRefreshToken()
	if err != nil {
		return nil, err
	}

	session := models.RefreshToken{
		UserID:    user.ID,
		TokenHash: hashRefreshToken(refreshToken),
		ExpiresAt: time.Now().Add(s.RefreshTTL),
	}

	if err := tx.Create(&session).Error; err != nil {
		return nil, err
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    int64(s.AccessTTL.Seconds()),
	}, nil
}

func (s *AuthService) Register(
	name, email, password string,
) (*models.User, *TokenPair, error) {
	name = strings.TrimSpace(name)
	email = strings.ToLower(strings.TrimSpace(email))

	if name == "" ||
		len(name) > 100 ||
		email == "" ||
		len(email) > 254 ||
		len(password) < 8 ||
		len(password) > 72 {
		return nil, nil, ErrInvalidInput
	}

	if _, err := mail.ParseAddress(email); err != nil {
		return nil, nil, ErrInvalidInput
	}

	var user models.User
	var tokens *TokenPair

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}

		user = models.User{
			Name:     name,
			Email:    email,
			Password: string(hashedPassword),
			Role:     "user",
		}

		if err := tx.Create(&user).Error; err != nil {
			// Constraint unique pada database tetap menjadi
			// perlindungan utama terhadap email duplikat.
			if strings.Contains(strings.ToLower(err.Error()), "unique") ||
				strings.Contains(strings.ToLower(err.Error()), "duplicate") {
				return ErrEmailExists
			}
			return err
		}

		tokens, err = s.issueSession(tx, &user)
		return err
	})

	if err != nil {
		return nil, nil, err
	}

	return &user, tokens, nil
}

func (s *AuthService) Login(
	email, password string,
) (*models.User, *TokenPair, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	var user models.User

	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, ErrInvalidCredentials
		}
		return nil, nil, err
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	); err != nil {
		return nil, nil, ErrInvalidCredentials
	}

	var tokens *TokenPair

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		var err error
		tokens, err = s.issueSession(tx, &user)
		return err
	})

	if err != nil {
		return nil, nil, err
	}

	return &user, tokens, nil
}

// Refresh mencabut refresh token lama dan menerbitkan token baru.
func (s *AuthService) Refresh(raw string) (*TokenPair, error) {
	if raw == "" {
		return nil, ErrInvalidRefresh
	}

	var tokens *TokenPair

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		var old models.RefreshToken

		err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("token_hash = ?", hashRefreshToken(raw)).
			First(&old).Error

		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrInvalidRefresh
			}
			return err
		}

		now := time.Now()

		if old.RevokedAt != nil || !old.ExpiresAt.After(now) {
			return ErrInvalidRefresh
		}

		var user models.User

		if err := tx.First(&user, old.UserID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrInvalidRefresh
			}
			return err
		}

		if user.Role != "user" && user.Role != "admin" {
			return ErrInvalidRefresh
		}

		if err := tx.Model(&old).Update("revoked_at", &now).Error; err != nil {
			return err
		}

		tokens, err = s.issueSession(tx, &user)
		return err
	})

	if err != nil {
		return nil, err
	}

	return tokens, nil
}

// Logout mencabut refresh token agar tidak dapat digunakan kembali.
func (s *AuthService) Logout(raw string) error {
	if raw == "" {
		return ErrInvalidRefresh
	}

	now := time.Now()

	result := s.DB.Model(&models.RefreshToken{}).
		Where("token_hash = ?", hashRefreshToken(raw)).
		Where("revoked_at IS NULL").
		Update("revoked_at", &now)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return ErrInvalidRefresh
	}

	return nil
}

func (s *AuthService) GetUserByID(id uint) (*models.User, error) {
	var user models.User

	if err := s.DB.First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}


func (s *AuthService) UpdateProfile(
	userID uint,
	name, email string,
) (*models.User, error) {
	name = strings.TrimSpace(name)
	email = strings.ToLower(strings.TrimSpace(email))

	if name == "" || len(name) > 100 ||
		email == "" || len(email) > 254 {
		return nil, ErrInvalidInput
	}

	if _, err := mail.ParseAddress(email); err != nil {
		return nil, ErrInvalidInput
	}

	var user models.User

	err := s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&user, userID).Error; err != nil {
			return err
		}

		var count int64
		if err := tx.Model(&models.User{}).
			Where("email = ? AND id <> ?", email, userID).
			Count(&count).Error; err != nil {
			return err
		}

		if count > 0 {
			return ErrEmailExists
		}

		if err := tx.Model(&user).Updates(map[string]interface{}{
			"name":  name,
			"email": email,
		}).Error; err != nil {
			return err
		}

		user.Name = name
		user.Email = email

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *AuthService) ChangePassword(
	userID uint,
	currentPassword, newPassword string,
) error {
	if len(newPassword) < 8 || len(newPassword) > 72 {
		return ErrInvalidInput
	}

	if currentPassword == "" {
		return ErrInvalidInput
	}

	return s.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User

		if err := tx.First(&user, userID).Error; err != nil {
			return err
		}

		if err := bcrypt.CompareHashAndPassword(
			[]byte(user.Password),
			[]byte(currentPassword),
		); err != nil {
			return ErrInvalidCredentials
		}

		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(newPassword),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}

		if err := tx.Model(&user).Update(
			"password",
			string(hashedPassword),
		).Error; err != nil {
			return err
		}

		// Cabut seluruh refresh token milik user.
		now := time.Now()

		return tx.Model(&models.RefreshToken{}).
			Where("user_id = ?", userID).
			Where("revoked_at IS NULL").
			Update("revoked_at", &now).Error
	})
}
