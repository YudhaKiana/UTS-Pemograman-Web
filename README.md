# UTS-Pemograman-Web

# 📚 BukuKita – Aplikasi Web Pemesanan Buku

Tugas UTS **Pemrograman Web 1** – aplikasi web sederhana untuk pemesanan buku pada toko online.
Fokus pada **front-end**: HTML, CSS, dan JavaScript murni (tanpa framework, tanpa server/database).
Data diambil dari variabel JavaScript pada file terpisah (`js/data.js`).

| | |
|---|---|
| **Nama** | [YUDHA EKA P] |
| **NIM** | [312210362] |
| **Mata Kuliah** | Pemrograman Web 1 |
| **Video Penjelasan** | [https://youtu.be/9YeH9TyAKMI?si=QhGB1X4WAPfe5Nj3] |
| **Demo Online** | [Link GitHub Pages, jika ada] |

---

## 🎯 Tujuan dan Indikator Pembelajaran

1. Merancang struktur HTML yang **semantik dan valid**.
2. Mengelola gaya antarmuka menggunakan **CSS** (external, dengan CSS variables, Flexbox, dan Grid).
3. Menggunakan **JavaScript** untuk manipulasi DOM, validasi form, manipulasi data tabel, dan interaksi UI (pop-up, modal box, alert box).

---

## ✨ Fitur per Halaman

| Halaman | File | Fitur Utama |
|---|---|---|
| **Login** | `index.html` | Input email & password, validasi, pop-up *"Email/password yang anda masukkan salah"*, modal **Lupa Password** dan **Daftar** |
| **Dashboard** | `dashboard.html` | Greeting otomatis sesuai waktu lokal (pagi/siang/sore/malam), 4 menu navigasi |
| **Katalog / Stok** | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, **tambah baris stok baru lewat DOM**, hapus, dan pencarian |
| **Pemesanan** | `checkout.html` | Tambah/ubah/hapus item pesanan, total otomatis, form pemesan & pembayaran, nomor Delivery Order otomatis |
| **Tracking** | `tracking.html` | Cari nomor DO, tampil nama pemesan, ekspedisi, tanggal kirim, paket, total, progress bar, langkah status, dan timeline perjalanan |
| **Riwayat** *(tambahan)* | `riwayat.html` | Tabel seluruh transaksi beserta status |

---

## 🗂️ Struktur Folder

```
tugas-uts-web1/
├── index.html          # Halaman login
├── dashboard.html      # Menu utama
├── stok.html           # Informasi stok / katalog
├── checkout.html       # Pemesanan
├── tracking.html       # Informasi pengiriman
├── riwayat.html        # History transaksi
├── css/
│   └── style.css       # Seluruh gaya (external CSS)
├── js/
│   ├── data.js         # Data dummy: dataPengguna, dataKatalogBuku, dataTracking
│   └── script.js       # Logika aplikasi (DOM, validasi, modal)
├── assets/             # Logo (opsional)
└── img/                # Cover buku
```

**Alasan pemisahan file (modularitas):** tampilan (`css`), data (`data.js`), dan logika (`script.js`) dipisah agar mudah dibaca, diubah, dan dikembangkan. Mengganti data cukup dengan mengedit `data.js`.

---

## 🚀 Cara Menjalankan

1. Clone atau unduh repository ini.
   ```bash
   git clone https://github.com/<username>/tugas-uts-web1.git
   ```
2. Buka file `index.html` di browser (klik dua kali). Tidak perlu server atau instalasi apa pun.
3. *(Opsional)* Letakkan gambar cover pada folder `img/` sesuai nama di `data.js` (mis. `pengantar_komunikasi.jpg`). Jika gambar tidak ada, aplikasi menampilkan ikon pengganti.

### 🔑 Akun untuk Login

| Email | Password | Role |
|---|---|---|
| rina@gmail.com | rina123 | User |
| agus@gmail.com | agus123 | User |
| siti@gmail.com | siti123 | Admin |

### 🔎 Nomor Delivery Order untuk Uji Tracking

`20230012` (Dalam Perjalanan) dan `20230013` (Dikirim). Pesanan baru dari halaman Pemesanan juga dapat dilacak.

---

## 🧱 Penjelasan Teknis

### 1. HTML Semantik
- Elemen: `<header>`, `<nav>` (dengan `aria-label`), `<main>`, `<section>`, `<footer>`, `<form>`, `<fieldset>`/`<legend>`, `<table>` (`thead`/`tbody`/`tfoot`), `<ol>`, `<dl>`.
- Setiap input memiliki `<label for>` yang terhubung ke `id`.
- Tipe input sesuai fungsi: `email`, `password`, `number`, `search`, `radio`.
- Atribut dasar lengkap: `lang="id"`, `charset`, `viewport`, `title`, `alt` pada gambar.

### 2. CSS
- **External CSS** di `css/style.css`, di-link pada semua halaman.
- **CSS Variables** (`:root`) untuk palet warna sehingga tema mudah diganti.
- **Flexbox** (navbar, baris tombol) dan **Grid** (menu dashboard, form dengan `auto-fit`).
- **Responsif** dengan `@media`, tabel dibungkus `overflow-x:auto`.
- Efek interaktif: hover, fokus input, animasi modal, badge warna, progress bar.

### 3. JavaScript
- **Satu `script.js`, banyak halaman:** atribut `data-page` pada `<body>` menentukan blok kode yang dijalankan.
- **Manipulasi DOM:** `createElement`, `appendChild`, `innerHTML`, `addEventListener`, event delegation pada tabel.
- **Data:** array/objek dari `data.js` dinormalisasi (mis. `"Rp 180.000"` → `180000`) agar dapat dihitung.
- **Penyimpanan:** `localStorage` (akun baru, stok baru, pesanan) dan `sessionStorage` (sesi login).
- **Proteksi halaman:** pengguna yang belum login diarahkan kembali ke halaman login.
- **Greeting:** `new Date().getHours()` → Pagi (<11), Siang (<15), Sore (<18), Malam.

---

## ✅ Validasi Form dan Alert

| Form | Aturan Validasi |
|---|---|
| Login | Wajib diisi, format email valid, kecocokan dengan data pengguna (jika salah → pop-up) |
| Lupa Password | Email valid dan terdaftar |
| Daftar | Semua field wajib, email valid, password minimal 5 karakter, email belum terdaftar |
| Tambah Stok | Semua field wajib, harga/stok tidak negatif, kode buku unik |
| Pemesanan | Item tidak boleh kosong, jumlah tidak melebihi stok, data pemesan wajib, email valid, format telepon Indonesia (`08xxxxxxxxxx`/`+628…`) |
| Tracking | Nomor DO wajib diisi, pesan error jika tidak ditemukan |

Feedback ditampilkan sebagai **pesan error inline** dan **modal pop-up** (pengganti `alert()` bawaan browser yang lebih konsisten dengan desain).

---

## 📋 Pemetaan terhadap Kriteria Penilaian

| Kriteria | Implementasi |
|---|---|
| Struktur HTML semantik, valid, lengkap | Elemen semantik, label-input terhubung, atribut dasar lengkap di 6 halaman |
| Desain CSS | External CSS, variables, Flexbox/Grid, responsif |
| JavaScript DOM | Tabel dinamis, tambah/ubah/hapus baris, render ulang, timeline & progress bar |
| Validasi form & alert | Validasi di 6 form, pesan error inline dan modal |
| Modularitas file & struktur | Pemisahan `css/`, `js/data.js`, `js/script.js`, `img/`, `assets/` |
| Kreativitas tambahan | Tema gradasi, halaman riwayat, pencarian katalog, timeline paket, sesi login, `localStorage` |
| Video penjelasan | Lihat tautan video di bagian atas |

---

## 🖼️ Tangkapan Layar

> Tambahkan screenshot ke folder `screenshots/` lalu sesuaikan tautannya.

| Login | Dashboard |
|---|---|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Katalog | Pemesanan |
|---|---|
| ![Katalog](screenshots/stok.png) | ![Pemesanan](screenshots/checkout.png) |

| Tracking |
|---|
| ![Tracking](screenshots/tracking.png) |

---

## ⚠️ Keterbatasan

- Tidak ada backend, sehingga password disimpan apa adanya di `data.js` dan `localStorage`. Ini hanya untuk keperluan pembelajaran, **bukan praktik keamanan yang benar**.
- Data tambahan hanya tersimpan di browser yang digunakan. Untuk mengatur ulang: DevTools (F12) → Application → Local Storage → Clear.
- Stok pada katalog tidak berkurang otomatis setelah pesanan dibuat.

## 🔮 Pengembangan Selanjutnya

- Integrasi backend dan database (mis. Node.js + MySQL) dan hashing password.
- Pengurangan stok otomatis dan peran Admin untuk pengelolaan katalog.
- Mode gelap dan cetak invoice pesanan.

---

## 🌐 Publikasi dengan GitHub Pages

1. Buka repository → **Settings** → **Pages**.
2. Pada *Source* pilih branch `main` dan folder `/ (root)`, lalu **Save**.
3. Tunggu beberapa menit, situs aktif di `https://<username>.github.io/tugas-uts-web1/`.

## 📤 Mengunggah ke GitHub

```bash
cd tugas-uts-web1
git init
git add .
git commit -m "Tugas UTS Pemrograman Web 1 - BukuKita"
git branch -M main
git remote add origin https://github.com/<username>/tugas-uts-web1.git
git push -u origin main
```

---

© 2026 [YUDHA EKA P] – Tugas UTS Pemrograman Web 1
