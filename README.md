# SIP — Sistem Informasi Pengadaan

Tugas Besar Pemrograman Web | Kelompok B9 | Universitas Andalas

Aplikasi web berbasis Node.js untuk mengelola proses pengadaan barang/jasa di lingkungan kampus, dilengkapi autentikasi berbasis sesi dan kontrol akses berbasis role (RBAC).

---

## Anggota & Modul

| Nama | NIM | Modul |
| --- | --- | --- |
| Mikail | 2411523016 | Permintaan Pengadaan |
| Ghezy | 2411522036 | Portal Approval + Auth |
| Mutiara | 2411523008 | Purchase Order + Dashboard |
| Nadila | 2411523025 | Stok & Penerimaan Barang |

---

## Tech Stack

| Layer | Teknologi |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js v5 |
| Template Engine | EJS + express-ejs-layouts |
| Database | MySQL (via mysql2 — raw SQL, tanpa ORM) |
| Auth | express-session + bcrypt |
| Config | dotenv |

> **Catatan :** Project ini menggunakan query SQL langsung (mysql2) tanpa ORM seperti Sequelize atau Prisma.

---

## Prasyarat

Pastikan sudah terinstall:

- **Node.js** v18 atau lebih baru
- **MySQL** v8 atau lebih baru

---

## Instalasi & Menjalankan

### 1. Clone / download project

```bash
git clone <url-repo>
cd SourceCode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Buat file `.env` di root project (atau salin dari `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_pengadaan
SESSION_SECRET=rahasia_sesi_anda
PORT=3000
```

### 4. Siapkan database

Buat database MySQL, lalu import skema:

```sql
CREATE DATABASE db_pengadaan;
USE db_pengadaan;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE model_has_roles (
    model_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

Tambahkan data awal:

```sql
INSERT INTO roles (name) VALUES ('Admin'), ('Wakil Dekan');
```

### 5. Tambahkan user ke database

App ini belum memiliki halaman registrasi. User harus ditambahkan manual, namun password **wajib** dalam bentuk hash bcrypt karena app menggunakan `bcrypt.compare()` saat login, password plain text tidak akan bisa login.

Jalankan script berikut sekali untuk generate hash, lalu salin hasilnya:

```bash
node -e "const b=require('bcrypt'); b.hash('password_anda',10).then(h=>console.log(h))"
```

Setelah dapat hash-nya, masukkan user ke database:

```sql
INSERT INTO users (name, email, password)
VALUES ('Admin SIP', 'admin@example.com', '<hash_dari_script_di_atas>');

-- Hubungkan user dengan role Admin (role_id=1)
INSERT INTO model_has_roles (model_id, role_id) VALUES (1, 1);
```

### 6. Jalankan server

```bash
node app.js
```

Aplikasi berjalan di <http://localhost:3000>

---

## Struktur Folder

```text
SourceCode/
├── app.js                  # Entry point, konfigurasi Express
├── db.js                   # Koneksi pool MySQL
├── .env                    # Environment variables (buat sendiri)
├── package.json
├── controllers/
│   └── authController.js   # Logic login & logout
├── middleware/
│   └── auth.js             # Middleware isLoggedIn & checkRole
├── routes/
│   ├── index.js            # Route utama (dashboard, PO, stok)
│   └── auth.js             # Route autentikasi
├── views/
│   ├── layout.ejs          # Template layout utama
│   ├── login.ejs           # Halaman login
│   ├── dashboard.ejs       # Halaman dashboard
│   ├── pengadaan/
│   ├── po/
│   ├── stok/
│   └── wadir/
└── public/
    ├── css/
    ├── js/
    └── img/
```

---

## Route & Hak Akses

| Method | URL | Akses | Keterangan |
| --- | --- | --- | --- |
| GET | `/login` | Publik | Form login |
| POST | `/login` | Publik | Proses autentikasi |
| GET | `/logout` | Login | Logout & hapus sesi |
| GET | `/dashboard` | Login | Dashboard utama |
| GET | `/po` | Admin | Modul Purchase Order |
| GET | `/stok` | Admin | Modul Stok |

---

## Role Pengguna

| Role | Akses |
| --- | --- |
| **Admin** | Dashboard, PO, Stok |
| **Wakil Dekan** | Dashboard |
