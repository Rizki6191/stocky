package database

import (
	"fmt"
	"log"
	"time"

	"stocky/config"
	"stocky/models"

	"gorm.io/gorm"
)

type categorySeed struct {
	Name        string
	Description string
}

type productSeed struct {
	Name        string
	Description string
	Price       int64
	Stock       int
	ImageURL    string
}

// Seed mengisi data awal Stocky secara manual.
// Konfigurasi dan koneksi menggunakan package yang sudah tersedia.
func Seed() error {
	cfg := config.Load()

	db, err := Connect(cfg)
	if err != nil {
		return fmt.Errorf("gagal koneksi database untuk seeder: %w", err)
	}

	if err := seedData(db); err != nil {
		return fmt.Errorf("seeder gagal, transaksi dibatalkan: %w", err)
	}

	log.Println("Seeder berhasil.")
	log.Println("- 5 kategori")
	log.Println("- 25 produk dengan gambar")
	log.Println("- 5 banner")
	log.Println("- 5 promo")

	return nil
}

func seedData(db *gorm.DB) error {
	categories := []categorySeed{
		{"Electronics", "Perangkat elektronik dan gadget"},
		{"Fashion", "Pakaian dan aksesori fashion"},
		{"Home & Living", "Perlengkapan rumah dan dekorasi"},
		{"Accessories", "Aksesori untuk aktivitas sehari-hari"},
		{"Gaming", "Perlengkapan gaming dan komputer"},
	}

	images := []string{
		"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
		"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
		"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
		"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
		"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
	}

	products := [][]productSeed{
		{
			{"Wireless Headphones", "Headphone nirkabel untuk musik dan aktivitas harian", 599000, 30, images[0]},
			{"Desk Lamp", "Lampu meja minimalis untuk ruang kerja", 249000, 25, images[1]},
			{"Classic Wristwatch", "Jam tangan bergaya klasik", 799000, 15, images[2]},
			{"Travel Backpack", "Tas ransel untuk perjalanan dan sekolah", 349000, 40, images[3]},
			{"Mechanical Keyboard", "Keyboard mekanis untuk produktivitas dan gaming", 899000, 20, images[4]},
		},
		{
			{"Everyday Headphones", "Headphone bergaya modern untuk penggunaan sehari-hari", 459000, 18, images[0]},
			{"Minimalist Shirt", "Kemeja kasual dengan desain minimalis", 199000, 50, images[1]},
			{"Classic Fashion Watch", "Jam tangan untuk melengkapi penampilan", 699000, 12, images[2]},
			{"Casual Backpack", "Ransel kasual untuk berbagai kegiatan", 279000, 35, images[3]},
			{"Graphic T-Shirt", "Kaos kasual dengan desain modern", 149000, 60, images[4]},
		},
		{
			{"Ambient Desk Lamp", "Lampu ambient untuk meja dan kamar", 299000, 24, images[1]},
			{"Living Room Clock", "Jam bergaya klasik untuk dekorasi ruangan", 189000, 20, images[2]},
			{"Storage Backpack", "Tas multifungsi untuk penyimpanan", 319000, 25, images[3]},
			{"Home Office Keyboard", "Keyboard untuk meja kerja di rumah", 499000, 16, images[4]},
			{"Relaxing Headphones", "Headphone untuk menikmati audio dengan nyaman", 549000, 22, images[0]},
		},
		{
			{"Premium Wristwatch", "Jam tangan premium untuk aktivitas harian", 999000, 10, images[2]},
			{"Daily Backpack", "Tas ransel praktis dengan ruang penyimpanan luas", 399000, 28, images[3]},
			{"Wireless Audio", "Perangkat audio nirkabel", 629000, 20, images[0]},
			{"Reading Lamp", "Lampu meja untuk membaca dan belajar", 219000, 30, images[1]},
			{"Compact Keyboard", "Keyboard ringkas untuk ruang kerja", 449000, 18, images[4]},
		},
		{
			{"Gaming Headphones", "Headphone untuk bermain game dan komunikasi", 749000, 20, images[0]},
			{"Gaming Desk Lamp", "Lampu meja untuk setup gaming", 329000, 14, images[1]},
			{"Gaming Watch", "Jam tangan bergaya sporty", 579000, 12, images[2]},
			{"Gaming Gear Backpack", "Tas untuk membawa aksesori gaming", 429000, 16, images[3]},
			{"Gaming Mechanical Keyboard", "Keyboard mekanis untuk bermain game", 1199000, 15, images[4]},
		},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		for categoryIndex, data := range categories {
			category := models.Category{
				Name:        data.Name,
				Description: data.Description,
			}

			if err := tx.Where("name = ?", data.Name).
				FirstOrCreate(&category).Error; err != nil {
				return fmt.Errorf("gagal membuat kategori %q: %w", data.Name, err)
			}

			for _, item := range products[categoryIndex] {
				product := models.Product{
					Name:        item.Name,
					Description: item.Description,
					Price:       item.Price,
					Stock:       item.Stock,
					IsActive:    true,
					CategoryID:  category.ID,
				}

				if err := tx.Where(
					"name = ? AND category_id = ?",
					item.Name, category.ID,
				).FirstOrCreate(&product).Error; err != nil {
					return fmt.Errorf("gagal membuat produk %q: %w", item.Name, err)
				}

				productImage := models.ProductImage{
					ProductID: product.ID,
					URL:       item.ImageURL,
					IsPrimary: true,
					SortOrder: 1,
				}

				if err := tx.Where(
					"product_id = ? AND url = ?",
					product.ID, item.ImageURL,
				).FirstOrCreate(&productImage).Error; err != nil {
					return fmt.Errorf("gagal membuat gambar produk %q: %w", item.Name, err)
				}
			}
		}

		now := time.Now()
		start := now.Add(-24 * time.Hour)
		end := now.AddDate(1, 0, 0)

		banners := []models.Banner{
			{
				Title:       "Upgrade Your Setup",
				Description: "Temukan perlengkapan untuk produktivitasmu",
				ImageURL:    images[4],
				LinkURL:     "/products",
				ButtonText:  "Belanja Sekarang",
				SortOrder:   1,
				StartAt:     &start,
				EndAt:       &end,
				IsActive:    true,
			},
			{
				Title:       "Everyday Essentials",
				Description: "Produk pilihan untuk kebutuhan sehari-hari",
				ImageURL:    images[3],
				LinkURL:     "/products",
				ButtonText:  "Lihat Produk",
				SortOrder:   2,
				StartAt:     &start,
				EndAt:       &end,
				IsActive:    true,
			},
			{
				Title:       "Audio Experience",
				Description: "Nikmati audio dengan perangkat pilihan",
				ImageURL:    images[0],
				LinkURL:     "/products",
				ButtonText:  "Jelajahi",
				SortOrder:   3,
				StartAt:     &start,
				EndAt:       &end,
				IsActive:    true,
			},
			{
				Title:       "Workspace Refresh",
				Description: "Buat ruang kerjamu lebih nyaman",
				ImageURL:    images[1],
				LinkURL:     "/products",
				ButtonText:  "Temukan Sekarang",
				SortOrder:   4,
				StartAt:     &start,
				EndAt:       &end,
				IsActive:    true,
			},
			{
				Title:       "Timeless Accessories",
				Description: "Lengkapi penampilanmu dengan aksesori pilihan",
				ImageURL:    images[2],
				LinkURL:     "/products",
				ButtonText:  "Lihat Koleksi",
				SortOrder:   5,
				StartAt:     &start,
				EndAt:       &end,
				IsActive:    true,
			},
		}

		for _, banner := range banners {
			if err := tx.Where("title = ?", banner.Title).
				FirstOrCreate(&banner).Error; err != nil {
				return fmt.Errorf("gagal membuat banner %q: %w", banner.Title, err)
			}
		}

		promos := []models.Promo{
			{
				Code:            "STOCKY10",
				Name:            "Diskon 10%",
				Description:     "Diskon 10% untuk pembelian pilihan",
				DiscountType:    "percentage",
				DiscountValue:   10,
				MinimumAmount:   100000,
				MaximumDiscount: int64Ptr(100000),
				UsageLimit:      100,
				UsedCount:       0,
				StartAt:         start,
				EndAt:           end,
				IsActive:        true,
			},
			{
				Code:            "HEMAT20",
				Name:            "Diskon 20%",
				Description:     "Promo diskon 20%",
				DiscountType:    "percentage",
				DiscountValue:   20,
				MinimumAmount:   250000,
				MaximumDiscount: int64Ptr(150000),
				UsageLimit:      100,
				UsedCount:       0,
				StartAt:         start,
				EndAt:           end,
				IsActive:        true,
			},
			{
				Code:          "NEWUSER",
				Name:          "Promo Pengguna Baru",
				Description:   "Diskon untuk pengguna baru",
				DiscountType:  "fixed",
				DiscountValue: 50000,
				MinimumAmount: 150000,
				UsageLimit:    100,
				UsedCount:     0,
				StartAt:       start,
				EndAt:         end,
				IsActive:      true,
			},
			{
				Code:          "BELANJA500",
				Name:          "Hemat 75 Ribu",
				Description:   "Potongan harga untuk transaksi tertentu",
				DiscountType:  "fixed",
				DiscountValue: 75000,
				MinimumAmount: 500000,
				UsageLimit:    50,
				UsedCount:     0,
				StartAt:       start,
				EndAt:         end,
				IsActive:      true,
			},
			{
				Code:            "GADGET15",
				Name:            "Promo Gadget",
				Description:     "Diskon 15% untuk produk pilihan",
				DiscountType:    "percentage",
				DiscountValue:   15,
				MinimumAmount:   300000,
				MaximumDiscount: int64Ptr(200000),
				UsageLimit:      75,
				UsedCount:       0,
				StartAt:         start,
				EndAt:           end,
				IsActive:        true,
			},
		}

		for _, promo := range promos {
			if err := tx.Where("code = ?", promo.Code).
				FirstOrCreate(&promo).Error; err != nil {
				return fmt.Errorf("gagal membuat promo %q: %w", promo.Code, err)
			}
		}

		return nil
	})
}

func int64Ptr(value int64) *int64 {
	return &value
}