# {BacaBisa} — Sistem Pakar Analisis Tingkat Keparahan Disleksia (CBR)

Aplikasi web Sistem Pakar untuk **Analisis Tingkat Keparahan Disleksia (Ringan, Sedang, Berat) pada Anak Usia Sekolah Dasar** menggunakan metode **Case-Based Reasoning (CBR)**.

> **Tugas Besar Mata Kuliah Sistem Pakar**  
> Program Studi Teknik Informatika, Fakultas Teknik, **Universitas Janabadra Yogyakarta**  
> **Anggota Tim Pengembang:**
> - Ridwan Nazar (NIM: 23330032)
> - Elita Inggriani (NIM: 23330036)
> - Kaysa Ramadhani (NIM: 23330037)

---

## 1. Ikhtisar & Alur Sistem

Pengguna (orang tua, guru kelas, atau terapis) mengamati perilaku membaca/menulis anak lalu memilih gejala yang muncul. Sistem membandingkan pola gejala tersebut dengan seluruh kasus di basis pengetahuan menggunakan formula **Weighted Similarity**, mengambil kasus paling mirip (Retrieval), mengadopsi solusinya (Reuse), serta menyediakan mekanisme evaluasi (Revise) dan penyimpanan kasus baru (Retain) oleh pakar.

> [!IMPORTANT]
> **DISCLAIMER MEDIS:** Hasil dari aplikasi ini adalah instrumen **skrining indikasi awal** berbasis komputasi cerdas, **BUKAN diagnosis medis resmi**. Konsultasikan ke psikolog anak atau dokter spesialis tumbuh kembang untuk pemeriksaan komprehensif.

---

## 2. Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Server Components)
- **Library UI**: React 18, Tailwind CSS (berbasis template asli **BigSpring** dari ThemeWagon/Themefisher)
- **Database**: PostgreSQL via library murni `pg` (tanpa ORM) dengan skema di `db/schema.sql` dan fallback penyimpanan lokal otomatis
- **Autentikasi & Keamanan**: JWT di HttpOnly cookie (`jose`), password hashing (`bcryptjs`), proteksi rute di `middleware.js`
- **Algoritma**: Case-Based Reasoning (CBR) 4R (*Retrieve, Reuse, Revise, Retain*) murni di `lib/cbr.js`

---

## 3. Cara Menjalankan Aplikasi

### Persyaratan Lingkungan
- Node.js versi 18+ (direkomendasikan Node 20 atau 24)
- PostgreSQL (opsional untuk lingkungan lokal, sistem dilengkapi fallback persisten otomatis jika server belum aktif)

### Langkah Instalasi
1. Gandakan repositori dan masuk ke folder proyek:
   ```bash
   cd "d:/UNIVERSITAS JANABADRA/SEMESTER VII/SISTEM PAKAR/BacaBisa"
   ```

2. Konfigurasi file `.env` (sudah disediakan contoh di `.env.example`):
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bacabisa
   AUTH_SECRET=bacabisa_secret_key_minimum_32_chars_long_2026!
   ADMIN_EMAIL=admin@bacabisa.ac.id
   ADMIN_PASSWORD=adminsecret123
   ```

3. Pasang dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Jalankan script setup dan seed basis data idempotent:
   ```bash
   npm run db:setup
   ```
   *(Perintah ini mengeksekusi `node --env-file=.env scripts/setup-db.mjs` yang membuat tabel, akun admin, 7 gejala, 20 kasus rujukan awal, dan saran penanganan).*

5. Jalankan unit test CBR dan pengujian integrasi:
   ```bash
   node test/cbr.test.mjs
   node test/e2e.test.mjs
   ```

6. Bangun berkas produksi (Build test):
   ```bash
   npm run build
   ```

7. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Buka peramban pada tautan: `http://localhost:3000`

---

## 4. Akun Pengguna & Administrator Bawaan

| Peran | Email | Kata Sandi | Akses Halaman |
|---|---|---|---|
| **Administrator** | `admin@bacabisa.ac.id` | `adminsecret123` | Akses penuh, Panel Admin, Revise, Retain, Bobot Gejala |
| **Pengguna Baru** | *Daftar mandiri di `/daftar`* | *Min. 6 Karakter* | Beranda, Menu Utama, Skrining Diagnosis, Riwayat Pribadi |

---

## 5. Daftar Rute Aplikasi

| Rute | Keterangan & Komponen | Hak Akses |
|---|---|---|
| `/` | Beranda pembuka: Hero, 6 Kartu Fitur, 2 Section Penjelasan, Alur 4R, dan Call-to-Action | Publik |
| `/login` | Form masuk dengan tab **Pengguna / Administrator** | Publik |
| `/daftar` | Registrasi akun pengguna baru (nama, email, sandi) | Publik |
| `/menu` | Menu utama bertema ruang kelas SD dengan navigasi kartu cepat | Pengguna Login |
| `/petunjuk` | Panduan langkah bernomor, pembacaan persentase kemiripan, dan disclaimer medis | Publik |
| `/pengembang` | Profil 3 anggota tim mahasiswa Universitas Janabadra & info arsitektur sistem | Publik |
| `/objek-penelitian` | Landasan teori disleksia, tabel gejala dinamis dari DB, alur CBR 4R, dan daftar pustaka | Publik |
| `/diagnosis` | Form input inisial anak + checklist 7 gejala (min. 1 terpilih) | Pengguna Login |
| `/diagnosis/hasil/[id]` | Hasil diagnosis: tingkat keparahan, progress bar kemiripan, top 3 match, saran | Pemilik / Admin |
| `/riwayat` | Arsip tabel diagnosis milik pengguna dengan tombol detail | Pengguna Login |
| `/admin` | Statistik sistem, tabel riwayat komprehensif, fitur **Revise** dan **Retain** | Administrator |
| `/admin/kasus` | Matriks biner 0/1 seluruh basis kasus, penambahan kasus baru, dan hapus kasus | Administrator |
| `/admin/gejala` | Form pengubahan bobot kepentingan ($w > 0$) untuk setiap gejala | Administrator |

---

## 6. Penjelasan Rumus Similarity CBR

Perhitungan similarity antara kasus baru ($K_{\text{baru}}$) dengan setiap kasus lama ($K_{\text{lama}}$) dilakukan pada **ketujuh gejala** ($n = 7$) menggunakan formula kemiripan berbobot:

$$\text{Similarity}(K_{\text{baru}}, K_{\text{lama}}) = \frac{\sum_{i=1}^{n} (w_i \times s_i)}{\sum_{i=1}^{n} w_i}$$

- **$w_i$**: Bobot kepentingan gejala ke-$i$ ($w > 0$).
  - G01 (3), G02 (2), G03 (2), G04 (2), G05 (3), G06 (3), G07 (1). Total $\sum w = 16$.
- **$s_i$**: Kesamaan status gejala ke-$i$:
  - $s_i = 1$, apabila status gejala sama persis (sama-sama dialami atau sama-sama tidak dialami).
  - $s_i = 0$, apabila status gejala berbeda.
- **Nilai Persentase**: $\text{Sim} \times 100\%$.
- **Tie-breaker**: Jika terdapat nilai kemiripan yang sama, kasus dengan jumlah gejala aktif yang sama terbanyak dipilih lebih dulu, kemudian diurutkan berdasarkan kode kasus terkecil.

### Contoh Uji:
1. Input `{G02, G03, G04}` $\rightarrow$ Cocok 100% dengan kasus **C08** (Sedang).
2. Input `{G01, G02, G03, G04, G05, G06, G07}` $\rightarrow$ Cocok 100% dengan kasus **C19** (Berat).
3. Input `{G02}` $\rightarrow$ Cocok 100% dengan kasus **C01** (Ringan).

---

## 7. Hal-Hal yang Perlu Divalidasi Lebih Lanjut oleh Pakar

Sebagai bagian dari integritas ilmiah dan etika sistem pakar, aspek-aspek berikut ditandai untuk divalidasi oleh pakar psikologi anak / dokter spesialis:
1. **Basis Kasus Ringan (C01–C07)**: Karena pada dokumen penelitian acuan primer hanya tersedia kasus Sedang dan Berat, kasus C01–C07 saat ini diisi data contoh (placeholder 1–2 gejala) dan diberi badge "contoh" di sistem. Pakar perlu memverifikasi apakah kombinasi gejala ini mencerminkan spektrum disleksia ringan di lapangan.
2. **Bobot Gejala ($w$)**: Nilai bobot awal (3, 2, 2, 2, 3, 3, 1) merupakan estimasi empiris. Admin dapat mengubahnya sewaktu-waktu di `/admin/gejala` berdasarkan arahan pakar.
3. **Teks Rekomendasi/Saran**: Teks saran penanganan awal per tingkat keparahan merupakan panduan umum multisensori aman yang perlu disesuaikan dengan kurikulum inklusi sekolah target.

---

## 8. Laporan Pengujian

### Telah Diuji & Lolos:
- [x] Inisialisasi basis data idempotent (`npm run db:setup`)
- [x] Kompilasi produksi Next.js tanpa galat (`npm run build`)
- [x] Unit test logika CBR 3 skenario wajib (`test/cbr.test.mjs`)
- [x] Pengujian integrasi penuh Auth, JWT, Registrasi, Login, dan Hak Akses (`test/e2e.test.mjs`)
- [x] Pengujian siklus 4R (Retrieve $\rightarrow$ Reuse $\rightarrow$ Revise $\rightarrow$ Retain $\rightarrow$ C21)
- [x] Proteksi rute middleware (Non-login dialihkan ke `/login`, non-admin dialihkan ke `/menu`)
- [x] Uji status HTTP seluruh 12 halaman utama dan sub-halaman
- [x] Desain responsif template BigSpring dan background ruang kelas SD di `/menu`

*(Pengujian dilakukan di lingkungan lokal Node.js v24 di OS Windows).*
