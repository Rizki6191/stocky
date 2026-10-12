package models

import "time"

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	Email    string `json:"email" gorm:"uniqueIndex;not null"`
	Password string `json:"-" gorm:"not null"`
	Role     string `json:"role" gorm:"not null;default:user"`

	Orders []Order `json:"orders,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Category struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"not null;uniqueIndex"`
	Description string `json:"description"`

	Products []Product `json:"products,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Product struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"not null;index"`
	Description string `json:"description" gorm:"not null"`
	Price       int64  `json:"price" gorm:"not null"`
	Stock       int    `json:"stock" gorm:"not null;default:0"`
	IsActive    bool   `json:"is_active" gorm:"not null;default:true"`

	CategoryID uint     `json:"category_id" gorm:"not null;index"`
	Category   Category `json:"category"`

	Images []ProductImage `json:"images,omitempty" gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ProductImage struct {
	ID uint `json:"id" gorm:"primaryKey"`

	ProductID uint `json:"product_id" gorm:"not null;index"`

	URL       string `json:"url" gorm:"not null"`
	IsPrimary bool   `json:"is_primary" gorm:"not null;default:false"`
	SortOrder int    `json:"sort_order" gorm:"not null;default:0"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Order struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"user_id" gorm:"not null;index"`
	User   User `json:"user"`

	OrderNumber string `json:"order_number" gorm:"uniqueIndex;not null"`

	TotalAmount int64 `json:"total_amount" gorm:"not null"`

	Status string `json:"status" gorm:"not null;default:pending"`

	Items []OrderItem `json:"items" gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE"`

	Payment Payment `json:"payment,omitempty" gorm:"foreignKey:OrderID"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OrderItem struct {
	ID uint `json:"id" gorm:"primaryKey"`

	OrderID uint `json:"order_id" gorm:"not null;index"`

	ProductID uint    `json:"product_id" gorm:"not null"`
	Product   Product `json:"product"`

	// Snapshot data saat pembelian
	ProductName string `json:"product_name" gorm:"not null"`
	Price       int64  `json:"price" gorm:"not null"`
	Quantity    int    `json:"quantity" gorm:"not null"`
	Subtotal    int64  `json:"subtotal" gorm:"not null"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Payment struct {
	ID uint `json:"id" gorm:"primaryKey"`

	OrderID uint `json:"order_id" gorm:"uniqueIndex;not null"`

	Provider  string `json:"provider" gorm:"not null"`
	Reference string `json:"reference" gorm:"index"`

	Amount int64  `json:"amount" gorm:"not null"`
	Status string `json:"status" gorm:"not null;default:pending"`

	PaymentURL string `json:"payment_url"`

	PaidAt *time.Time `json:"paid_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Promo struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Code        string `json:"code" gorm:"uniqueIndex;not null"`
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description"`

	DiscountType  string `json:"discount_type" gorm:"not null"`
	DiscountValue int64  `json:"discount_value" gorm:"not null"`

	// Minimum total pembelian agar promo dapat digunakan
	MinimumAmount int64 `json:"minimum_amount" gorm:"not null;default:0"`

	// Batas maksimal potongan untuk tipe percentage
	MaximumDiscount *int64 `json:"maximum_discount"`

	UsageLimit int `json:"usage_limit" gorm:"not null;default:0"`
	UsedCount  int `json:"used_count" gorm:"not null;default:0"`

	StartAt time.Time `json:"start_at"`
	EndAt   time.Time `json:"end_at"`

	IsActive bool `json:"is_active" gorm:"not null;default:true"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Banner struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Title       string `json:"title" gorm:"not null"`
	Description string `json:"description"`

	ImageURL string `json:"image_url" gorm:"not null"`

	LinkURL string `json:"link_url"`

	ButtonText string `json:"button_text"`

	SortOrder int `json:"sort_order" gorm:"not null;default:0"`

	StartAt *time.Time `json:"start_at"`
	EndAt   *time.Time `json:"end_at"`

	IsActive bool `json:"is_active" gorm:"not null;default:true"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type RefreshToken struct {
	ID uint `json:"id" gorm:"primarykey"`
	UserID uint `json:"user_id" gorm:"not null;index"`
	TokenHash string `json:"-" gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expired_at" gorm:"not null;index"`
	RevokedAt *time.Time `json:"-"`

	CreatedAt time.Time `json:"created_at"`
}
