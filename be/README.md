# Stocky Backend (BE)

Backend REST API untuk aplikasi e-commerce **Stocky**, dibangun menggunakan **Go (Golang)**, **Gin Web Framework**, dan **GORM** dengan database **PostgreSQL**.

---

## 🛠️ Tech Stack & Dependencies

- **Language:** Go 1.24+
- **Framework:** [Gin](https://github.com/gin-gonic/gin)
- **ORM:** [GORM](https://gorm.io/) (PostgreSQL Driver)
- **Database:** PostgreSQL 17 (Docker)
- **Authentication:** JWT (`golang-jwt/jwt/v5`) & Bcrypt (`golang.org/x/crypto/bcrypt`)
- **Configuration:** GoDotEnv (`joho/godotenv`)

---

## 🚀 Persiapan & Menjalankan Backend

### 1. Salin Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```bash
cp .env.example .env
```

Contoh konfigurasi standar (`.env`):
```env
APP_PORT=8000
APP_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=yuzu
DB_PASSWORD=yuzu
DB_NAME=stocky_db
DB_SSLMODE=disable

JWT_SECRET=your_secret_key_here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=168h
```

### 2. Jalankan Database PostgreSQL (Docker)
Pastikan Docker daemon berjalan, lalu jalankan container database:
```bash
docker compose up -d
```
Container `stocky_postgres` akan berjalan pada port `5432`.

### 3. Jalankan Aplikasi
Jalankan backend server:
```bash
go run .
```
Server akan berjalan secara default di `http://localhost:8000`.

---

## 📋 Struktur Arsitektur & Endpoint API

Base URL: `http://localhost:8000`

### 1. Health Check
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check server status | Publik |

---

### 2. Autentikasi (`/api/auth`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Mendaftarkan akun user baru | Publik |
| `POST` | `/api/auth/login` | Login user & mendapatkan access token + refresh token | Publik |
| `POST` | `/api/auth/refresh` | Memperbarui access token dengan refresh token | Publik |
| `POST` | `/api/auth/logout` | Revoke refresh token | Publik |
| `GET` | `/api/auth/me` | Mengambil data profil user yang login | Bearer Token |
| `PUT` | `/api/auth/me` | Memperbarui data profil user | Bearer Token |
| `PUT` | `/api/auth/password` | Mengganti password user | Bearer Token |

---

### 3. Katalog Publik (`/api`)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Menampilkan seluruh produk aktif | Publik |
| `GET` | `/api/products/:id` | Menampilkan detail produk berdasarkan ID | Publik |
| `GET` | `/api/categories` | Menampilkan daftar kategori | Publik |
| `GET` | `/api/categories/:id` | Menampilkan detail kategori berdasarkan ID | Publik |
| `GET` | `/api/banners` | Menampilkan banner promo aktif | Publik |
| `GET` | `/api/banners/:id` | Menampilkan detail banner aktif berdasarkan ID | Publik |

---

### 4. Keranjang Belanja / Cart (`/api/cart`)
*Wajib menyertakan header `Authorization: Bearer <access_token>`.*
Setiap user memiliki tepat 1 cart yang terhubung secara unik.

| Method | Endpoint | Request Body | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | - | Mengambil isi cart user beserta total item dan subtotal |
| `POST` | `/api/cart/items` | `{"product_id": uint, "quantity": int}` | Menambahkan item ke dalam cart |
| `PUT` | `/api/cart/items/:id` | `{"quantity": int}` | Memperbarui kuantitas item cart (`:id` adalah CartItem ID) |
| `DELETE` | `/api/cart/items/:id` | - | Menghapus item tertentu dari cart |
| `DELETE` | `/api/cart` | - | Mengosongkan seluruh item dari cart |

---

### 5. Pesanan / Orders (`/api/orders`)
*Wajib menyertakan header `Authorization: Bearer <access_token>`.*

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/orders/checkout` | Melakukan checkout pesanan dari keranjang belanja user. Memvalidasi stok, mengurangi kuantitas stok produk, membuat nomor pesanan (`STK-...`), dan mengosongkan keranjang belanja dalam satu database transaction yang atomic. |
| `GET` | `/api/orders` | Menampilkan daftar seluruh riwayat pesanan milik user yang sedang login. |
| `GET` | `/api/orders/:id` | Menampilkan detail pesanan berdasarkan ID milik user yang sedang login. |

---

### 6. Admin Panel (`/api/admin`)
*Wajib menyertakan header `Authorization: Bearer <access_token>` dengan role `admin`.*

| Fitur | Method | Endpoint | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Products** | `POST` | `/api/admin/products` | Tambah produk baru |
| | `PUT` | `/api/admin/products/:id` | Perbarui data produk |
| | `DELETE` | `/api/admin/products/:id` | Hapus produk |
| **Categories**| `POST` | `/api/admin/categories` | Tambah kategori baru |
| | `PUT` | `/api/admin/categories/:id` | Perbarui data kategori |
| | `DELETE` | `/api/admin/categories/:id` | Hapus kategori |
| **Banners** | `GET` | `/api/admin/banners` | Menampilkan semua banner (termasuk non-aktif) |
| | `GET` | `/api/admin/banners/:id` | Menampilkan detail banner |
| | `POST` | `/api/admin/banners` | Tambah banner baru |
| | `PUT` | `/api/admin/banners/:id` | Perbarui banner |
| | `DELETE` | `/api/admin/banners/:id` | Hapus banner |

---

## 🗄️ Skema Database (GORM AutoMigrate)

Relasi dan tabel yang dikelola otomatis oleh AutoMigrate:
- **`users`**: Data pengguna (`id`, `name`, `email`, `password`, `role`).
- **`refresh_tokens`**: Token rotasi refresh token autentikasi.
- **`categories`**: Kategori produk (`id`, `name`, `description`).
- **`products`**: Data produk katalog (`id`, `name`, `description`, `price`, `stock`, `is_active`, `category_id`).
- **`product_images`**: Gambar produk dengan relasi foreign key cascade ke produk.
- **`carts`**: Keranjang user (relasi 1-to-1 dengan `user_id`).
- **`cart_items`**: Item dalam cart dengan foreign key ke `cart` dan `product`.
- **`orders`**: Header pesanan user (`id`, `user_id`, `order_number`, `total_amount`, `status`).
- **`order_items`**: Detail item pesanan (snapshot nama produk, harga saat pembelian, kuantitas, dan subtotal).
- **`payments`**: Data pembayaran pesanan.
- **`promos`**: Kode voucher dan diskon.
- **`banners`**: Banner carousel promosi toko.