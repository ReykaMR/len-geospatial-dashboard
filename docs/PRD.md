# PRD - Aplikasi Manajemen Entitas Geografis

**Konteks:** Take-Home Test Software Developer - PT Len Inovasi Teknologi (Len IOT)  
**Status dokumen:** Rancangan produk untuk implementasi dan evaluasi  
**Versi:** 1.0

---

## 1. Ringkasan Produk

Aplikasi Manajemen Entitas Geografis adalah aplikasi web untuk menampilkan, melihat detail, dan mengelola berbagai entitas dunia nyata yang memiliki lokasi geografis.

Entitas dapat merepresentasikan objek seperti kendaraan, perangkat IoT, atau lokasi fasilitas. Setiap entitas mempunyai identitas, atribut dasar, status, serta koordinat geografis berupa latitude dan longitude.

Aplikasi terdiri dari frontend menggunakan React dan TypeScript serta backend menggunakan Go. Data entitas disimpan dan diambil melalui backend agar perubahan data dapat dipertahankan dan ditampilkan secara konsisten.

Produk ini dibuat untuk memenuhi kebutuhan utama take-home test. Fitur tambahan di luar persyaratan inti hanya dikerjakan setelah seluruh kebutuhan wajib berfungsi.

## 2. Latar Belakang dan Masalah

Pengguna perlu melihat dan mengelola entitas yang tersebar di lokasi geografis. Jika informasi hanya disajikan sebagai daftar tanpa konteks lokasi, pengguna akan kesulitan memahami persebaran entitas dan membuka informasi objek tertentu.

Aplikasi menyediakan satu antarmuka yang menggabungkan peta dan pengelolaan data entitas. Pengguna dapat melihat lokasi entitas, membuka detail, serta menambahkan, mengubah, dan menghapus data melalui aplikasi.

**Catatan ruang lingkup:** Soal tes tidak menetapkan domain bisnis khusus, jenis pengguna tertentu, autentikasi, pelacakan real-time, maupun integrasi perangkat IoT langsung. Karena itu, versi awal tidak mengasumsikan kebutuhan-kebutuhan tersebut.

## 3. Tujuan Produk

### 3.1 Tujuan utama

1. Menampilkan entitas dengan koordinat geografis valid pada peta.
2. Memungkinkan pengguna menambahkan entitas baru.
3. Memungkinkan pengguna melihat detail entitas.
4. Memungkinkan pengguna memperbarui data entitas.
5. Memungkinkan pengguna menghapus entitas.
6. Menyimpan dan mengambil data melalui backend Go.
7. Memvalidasi input dan data di frontend maupun backend.
8. Menyediakan dokumentasi yang memungkinkan aplikasi dijalankan dan dievaluasi.

### 3.2 Kriteria keberhasilan

Produk dianggap memenuhi kebutuhan inti apabila:

- Semua operasi CRUD utama dapat dilakukan melalui antarmuka.
- Data yang dibuat atau diubah disimpan melalui backend.
- Data yang telah disimpan dapat diambil kembali setelah halaman dimuat ulang.
- Entitas dengan koordinat valid ditampilkan di peta.
- Pengguna dapat membuka detail entitas dari marker pada peta.
- Input yang tidak valid ditolak oleh frontend dan backend.
- Kegagalan API atau penyimpanan ditampilkan secara jelas, bukan dilaporkan sebagai keberhasilan.
- Petunjuk instalasi, konfigurasi, penggunaan, dan pengujian tersedia dalam dokumentasi.

## 4. Pengguna dan Skenario Penggunaan

Soal tes tidak menetapkan persona pengguna. Untuk keperluan implementasi dan demonstrasi, diasumsikan ada satu pengguna aplikasi yang mengelola data entitas.

### Skenario utama

- Pengguna membuka aplikasi dan melihat peta beserta entitas yang tersedia.
- Pengguna memilih marker untuk melihat detail entitas.
- Pengguna menambahkan entitas dengan mengisi identitas, atribut, status, dan koordinat.
- Pengguna memilih entitas yang sudah ada untuk memperbarui informasi.
- Pengguna menghapus entitas setelah mengonfirmasi tindakan.
- Pengguna menerima pesan yang jelas ketika input tidak valid atau operasi gagal.

Asumsi ini hanya untuk membantu merancang alur UI; bukan persyaratan autentikasi atau peran pengguna.

## 5. Ruang Lingkup

### 5.1 Termasuk dalam versi awal (MVP)

- Antarmuka web React + TypeScript.
- Backend API menggunakan Go.
- Penyimpanan persisten untuk data entitas.
- Model data entitas dengan identitas, atribut dasar, status, dan koordinat.
- Peta yang menampilkan marker entitas.
- Melihat detail entitas dari peta.
- Membuat entitas.
- Mengubah entitas.
- Menghapus entitas dengan konfirmasi.
- Validasi input pada frontend dan backend.
- Penanganan status loading, kosong, sukses, dan gagal.
- Dokumentasi instalasi, konfigurasi, penggunaan, API, pilihan teknologi, serta penggunaan Agentic AI.
- Pengujian untuk fungsi utama.

### 5.2 Tidak termasuk dalam versi awal kecuali diminta atau waktu mencukupi

- Pelacakan lokasi real-time.
- Integrasi langsung dengan perangkat keras IoT.
- Pengiriman data telemetri.
- Autentikasi, manajemen pengguna, dan kontrol akses berbasis peran.
- Notifikasi, geofencing, dan alarm.
- Riwayat pergerakan atau audit perubahan entitas.
- Dashboard analitik lanjutan.
- Impor atau ekspor CSV/Excel.
- Pencarian alamat atau geocoding.
- Pengelompokan marker (marker clustering).
- Multi-tenant atau pengelolaan banyak organisasi.

Fitur-fitur ini tidak dinyatakan sebagai persyaratan dalam deskripsi tes. Jangan mengerjakannya sebelum semua kebutuhan inti terpenuhi.

## 6. Persyaratan Fungsional

### FR-01 - Menampilkan peta

**Deskripsi:** Aplikasi menampilkan peta sebagai konteks geografis untuk entitas.

**Kriteria penerimaan:**

- Peta tampil ketika layanan dan konfigurasi peta tersedia.
- Peta menampilkan marker untuk entitas yang mempunyai koordinat valid.
- Setiap marker terhubung ke satu entitas yang benar.
- Kegagalan memuat peta ditangani dengan pesan yang dapat dipahami.
- Ketentuan atribusi penyedia peta dipenuhi jika diwajibkan.

### FR-02 - Menampilkan entitas

**Deskripsi:** Aplikasi mengambil data entitas melalui backend dan menampilkan entitas pada peta.

**Kriteria penerimaan:**

- Frontend meminta data dari API backend.
- Data tidak hanya berasal dari hardcoded mock data.
- Entitas dengan koordinat valid ditampilkan sebagai marker.
- Jika belum ada entitas, aplikasi menampilkan keadaan kosong yang informatif.
- Jika API gagal, aplikasi menampilkan pesan kesalahan dan menyediakan cara mencoba kembali jika sesuai.
- Data yang gagal dimuat tidak ditampilkan seolah-olah berhasil diperoleh dari server.

### FR-03 - Melihat detail entitas

**Deskripsi:** Pengguna dapat memilih marker dan melihat informasi entitas.

**Kriteria penerimaan:**

- Memilih marker membuka tampilan detail, misalnya popup, panel, atau dialog.
- Detail menampilkan identitas dan atribut utama entitas.
- Detail menampilkan jenis, status, latitude, dan longitude jika kolom tersebut digunakan.
- Detail yang tampil sesuai dengan marker yang dipilih.
- Pengguna dapat menutup tampilan detail dan kembali ke peta.
- Dari detail, pengguna dapat memulai alur edit atau hapus jika desain UI mendukungnya.

### FR-04 - Menambahkan entitas

**Deskripsi:** Pengguna dapat membuat entitas baru melalui formulir.

**Kriteria penerimaan:**

- Formulir menyediakan kolom yang dibutuhkan untuk membentuk entitas.
- Kolom wajib dan format input divalidasi di frontend.
- Latitude berada pada rentang -90 sampai 90.
- Longitude berada pada rentang -180 sampai 180.
- Frontend mengirim permintaan pembuatan ke backend.
- Backend memvalidasi ulang payload.
- Jika berhasil, entitas tersimpan dan tampil pada peta tanpa perlu memuat ulang halaman secara manual.
- Jika gagal, aplikasi menampilkan pesan kesalahan dan tidak memberikan notifikasi sukses palsu.

### FR-05 - Memperbarui entitas

**Deskripsi:** Pengguna dapat mengubah data entitas yang sudah ada.

**Kriteria penerimaan:**

- Formulir edit diisi dengan data entitas saat ini.
- Pengguna dapat mengubah kolom yang diizinkan, termasuk koordinat jika didukung.
- Validasi frontend dan backend tetap berlaku.
- Jika berhasil, detail dan marker menampilkan data terbaru.
- Jika gagal, pengguna diberi tahu dan data server tidak dianggap sudah berubah.
- API membedakan entitas yang tidak ditemukan dari kesalahan internal.

### FR-06 - Menghapus entitas

**Deskripsi:** Pengguna dapat menghapus entitas yang sudah ada.

**Kriteria penerimaan:**

- Aplikasi meminta konfirmasi sebelum menghapus.
- Frontend mengirim permintaan penghapusan ke backend.
- Marker dan detail entitas dihapus dari UI setelah backend mengonfirmasi keberhasilan.
- Jika backend gagal, aplikasi menampilkan pesan kesalahan dan tidak berpura-pura bahwa penghapusan berhasil.
- Permintaan terhadap entitas yang tidak ditemukan ditangani secara konsisten.

### FR-07 - Validasi data

**Deskripsi:** Frontend dan backend sama-sama memvalidasi data entitas.

**Kriteria penerimaan:**

- Kolom wajib tidak boleh kosong.
- String wajib ditrim sebelum diperiksa.
- Latitude dan longitude harus berupa angka finite dan berada dalam rentang yang valid.
- Status harus berasal dari daftar nilai yang ditetapkan aplikasi.
- Jenis entitas harus divalidasi jika menggunakan daftar jenis yang dibatasi.
- Payload yang rusak atau tidak sesuai skema ditolak backend.
- Pesan kesalahan cukup jelas bagi pengguna dan tidak membocorkan detail internal.

### FR-08 - Persistensi data

**Deskripsi:** Backend menyimpan dan mengambil data dari penyimpanan persisten.

**Kriteria penerimaan:**

- Operasi create, read, update, dan delete bekerja melalui backend.
- Data yang dibuat dapat diambil kembali.
- Perubahan tetap ada setelah frontend dimuat ulang atau backend dijalankan ulang, sesuai karakteristik penyimpanan yang dipilih.
- Kegagalan database ditangani tanpa respons sukses palsu.
- Cara menyiapkan database dijelaskan dalam dokumentasi.

### FR-09 - Status dan umpan balik UI

**Deskripsi:** Aplikasi memberikan umpan balik untuk operasi dan keadaan data.

**Kriteria penerimaan:**

- Terdapat indikator loading ketika data sedang dimuat.
- Kondisi daftar kosong dibedakan dari kegagalan API.
- Pengiriman formulir dapat dicegah berulang kali saat permintaan berlangsung.
- Pesan sukses hanya muncul setelah operasi dinyatakan berhasil oleh backend.
- Pesan gagal tidak menghilangkan input pengguna secara tidak perlu.
- Kontrol utama memiliki label yang jelas dan dapat diakses.

## 7. Model Data yang Disarankan

Model berikut merupakan rancangan awal yang dapat disesuaikan dengan teknologi database.

| Kolom       | Tipe konseptual  | Aturan                                                          | Keterangan                                  |
| ----------- | ---------------- | --------------------------------------------------------------- | ------------------------------------------- |
| `id`        | String atau UUID | Wajib, unik, dibuat oleh sistem atau mekanisme yang ditentukan  | Identitas entitas                           |
| `name`      | String           | Wajib, tidak kosong setelah trim, panjang dibatasi secara wajar | Nama entitas                                |
| `type`      | String/enum      | Wajib, harus sesuai daftar tipe jika dibatasi                   | Contoh: `vehicle`, `iot_device`, `facility` |
| `status`    | String/enum      | Wajib, harus sesuai daftar status                               | Contoh status perlu ditentukan konsisten    |
| `latitude`  | Angka desimal    | Wajib; -90 sampai 90                                            | Koordinat lintang                           |
| `longitude` | Angka desimal    | Wajib; -180 sampai 180                                          | Koordinat bujur                             |
| `createdAt` | Timestamp        | Dibuat oleh sistem                                              | Waktu pembuatan                             |
| `updatedAt` | Timestamp        | Diperbarui oleh sistem                                          | Waktu perubahan terakhir                    |

### Aturan model

- Jangan menerima `id`, `createdAt`, atau `updatedAt` dari klien sebagai sumber kebenaran jika nilai tersebut dikelola backend.
- Tetapkan daftar `type` dan `status` secara eksplisit dan dokumentasikan nilainya.
- Gunakan representasi waktu yang konsisten, sebaiknya ISO 8601/RFC 3339 pada API.
- Gunakan tipe numerik yang sesuai untuk koordinat.
- Jangan menukar urutan latitude dan longitude.
- GeoJSON menggunakan urutan koordinat `[longitude, latitude]`; sesuaikan saat berinteraksi dengan pustaka peta.
- Jika ada atribut tambahan khusus jenis entitas, tentukan skema yang jelas dan jangan mengorbankan validasi.

## 8. Rancangan API Awal

Endpoint berikut merupakan usulan kontrak, bukan pernyataan bahwa endpoint telah diimplementasikan.

| Metode   | Endpoint                | Tujuan                        | Respons sukses yang disarankan |
| -------- | ----------------------- | ----------------------------- | ------------------------------ |
| `GET`    | `/api/v1/entities`      | Mengambil daftar entitas      | `200 OK`                       |
| `GET`    | `/api/v1/entities/{id}` | Mengambil detail entitas      | `200 OK`                       |
| `POST`   | `/api/v1/entities`      | Membuat entitas               | `201 Created`                  |
| `PUT`    | `/api/v1/entities/{id}` | Mengganti/memperbarui entitas | `200 OK`                       |
| `DELETE` | `/api/v1/entities/{id}` | Menghapus entitas             | `204 No Content`               |

### Konvensi API

- Gunakan JSON untuk payload jika tidak ada kebutuhan lain.
- Dokumentasikan bentuk request dan response.
- Gunakan kode status HTTP sesuai hasil operasi.
- Kembalikan kesalahan dengan format konsisten.
- Jangan menyertakan stack trace atau detail rahasia dalam respons.
- Gunakan kueri database berparameter atau mekanisme setara yang aman.
- Pastikan kontrak yang didokumentasikan sesuai dengan implementasi aktual.

Contoh format kesalahan konseptual:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid.",
    "fields": {
      "latitude": "Latitude harus berada di antara -90 dan 90."
    }
  }
}
```

Format ini dapat diubah, tetapi frontend dan backend harus sepakat pada kontrak finalnya.

## 9. Aturan Validasi

### Validasi frontend

- Memberikan umpan balik cepat sebelum permintaan dikirim.
- Menandai kolom yang salah.
- Mencegah pengiriman formulir jika input wajib tidak valid.
- Menampilkan pesan kesalahan dari backend.
- Tidak menggantikan validasi backend.

### Validasi backend

- Memeriksa payload dan tipe data.
- Memeriksa kolom wajib.
- Memeriksa panjang string.
- Memeriksa rentang koordinat dan nilai numerik finite.
- Memeriksa nilai `type` dan `status` yang diizinkan.
- Menangani ID yang tidak valid atau tidak ditemukan.
- Mengembalikan kode status dan pesan kesalahan yang sesuai.

### Kasus uji validasi minimum

- Nama kosong atau hanya berisi spasi.
- Latitude di bawah -90 atau di atas 90.
- Longitude di bawah -180 atau di atas 180.
- Koordinat berupa string kosong, teks, `NaN`, atau nilai non-finite lain.
- Status yang tidak dikenal.
- Jenis entitas yang tidak dikenal jika daftar jenis dibatasi.
- JSON rusak.
- Kolom wajib tidak disertakan.
- ID entitas tidak ditemukan saat detail, update, atau delete.

## 10. Alur Pengguna Utama

### 10.1 Membuka aplikasi

1. Pengguna membuka aplikasi.
2. Frontend memuat antarmuka peta.
3. Frontend meminta daftar entitas ke backend.
4. Backend mengambil data dari penyimpanan.
5. Frontend menampilkan marker untuk entitas yang memiliki koordinat valid.
6. Jika data kosong atau permintaan gagal, frontend menampilkan keadaan yang sesuai.

### 10.2 Melihat detail

1. Pengguna memilih marker.
2. Aplikasi mencari data entitas yang terhubung dengan marker tersebut.
3. Aplikasi menampilkan detail entitas.
4. Pengguna menutup detail atau memilih tindakan edit/hapus.

### 10.3 Menambahkan entitas

1. Pengguna memilih tombol tambah entitas.
2. Aplikasi menampilkan formulir.
3. Pengguna mengisi data dan koordinat.
4. Frontend memvalidasi input.
5. Frontend mengirim payload ke backend.
6. Backend memvalidasi ulang dan menyimpan data.
7. Backend mengembalikan hasil.
8. Frontend memperbarui data dan marker.
9. Jika gagal, frontend menampilkan pesan kesalahan.

### 10.4 Memperbarui entitas

1. Pengguna memilih entitas dan tindakan edit.
2. Formulir terisi dengan data yang tersimpan.
3. Pengguna mengubah kolom.
4. Frontend memvalidasi dan mengirim perubahan.
5. Backend memvalidasi serta menyimpan perubahan.
6. Frontend memperbarui detail dan marker setelah berhasil.

### 10.5 Menghapus entitas

1. Pengguna memilih tindakan hapus.
2. Aplikasi meminta konfirmasi.
3. Pengguna mengonfirmasi.
4. Frontend mengirim permintaan ke backend.
5. Backend menghapus data.
6. Setelah sukses, frontend menghapus marker dan detail dari tampilan.
7. Jika gagal, frontend menampilkan kesalahan.

## 11. Persyaratan Nonfungsional

### NFR-01 - Kemudahan pemeliharaan

- Kode memiliki pembagian tanggung jawab yang jelas.
- Nama variabel, fungsi, tipe, dan berkas mudah dipahami.
- Hindari duplikasi logika.
- Hindari abstraksi yang tidak diperlukan.

### NFR-02 - Keandalan data

- Backend menjadi sumber kebenaran untuk data persisten.
- Operasi gagal tidak boleh ditampilkan sebagai berhasil.
- Data yang tidak valid tidak disimpan.
- UI diselaraskan dengan hasil backend.

### NFR-03 - Keamanan dasar

- Validasi data dilakukan di backend.
- Operasi database aman terhadap injeksi.
- Rahasia tidak dimasukkan ke repositori.
- CORS dibatasi sesuai kebutuhan.
- Detail internal tidak dibocorkan kepada klien.
- Jika autentikasi ditambahkan, otorisasi diperiksa di backend.

Autentikasi bukan persyaratan eksplisit dalam deskripsi tes dan tidak harus ditambahkan jika tidak diperlukan.

### NFR-04 - Kegunaan dan aksesibilitas

- Formulir memiliki label yang jelas.
- Pesan kesalahan mudah dimengerti.
- Kontrol utama dapat digunakan dengan keyboard jika memungkinkan.
- Antarmuka tetap dapat digunakan pada ukuran layar yang wajar.
- Warna bukan satu-satunya pembeda status.

### NFR-05 - Keterulangan lingkungan

- Langkah menjalankan aplikasi terdokumentasi.
- Konfigurasi lingkungan dijelaskan.
- Inisialisasi database dapat diulang.
- Perintah pengujian dan build didokumentasikan.

### NFR-06 - Keterujian

- Logika validasi dapat diuji.
- Endpoint utama memiliki pengujian.
- Alur CRUD utama dapat diverifikasi.
- Hasil pengujian dilaporkan berdasarkan eksekusi nyata.

Tidak ada target numerik kinerja, ketersediaan, atau jumlah pengguna dalam soal. Jangan mengklaim target tersebut sebagai persyaratan resmi.

## 12. Rekomendasi Teknologi

Soal menetapkan React + TypeScript dan Go, tetapi tidak menetapkan library atau database tertentu. Pilihan berikut harus diputuskan berdasarkan kondisi repositori, kemudahan implementasi, dan waktu yang tersedia.

| Area               | Kriteria pemilihan                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Peta               | Integrasi React yang baik, dokumentasi jelas, atribusi dan lisensi dipahami, mudah didemonstrasikan |
| Database           | Setup mudah, persistensi andal, cocok untuk model CRUD                                              |
| Akses database Go  | Driver atau pustaka yang terawat dan sesuai skala aplikasi                                          |
| Validasi frontend  | Aturan jelas dan pesan kesalahan mudah ditampilkan                                                  |
| Styling            | Konsisten, responsif, dan cepat diterapkan                                                          |
| Pengujian frontend | Dapat menguji interaksi dan perilaku pengguna                                                       |
| Pengujian backend  | Mendukung pengujian handler, validasi, dan logika bisnis                                            |

Jangan menambahkan pustaka hanya untuk mengikuti rekomendasi dokumen ini. Catat pilihan final dan alasan sebenarnya di README.

## 13. Rencana Pengujian dan Kriteria Penerimaan

### Uji fungsional

- [ ] Daftar entitas berhasil diambil dari backend.
- [ ] Entitas dengan koordinat valid muncul pada peta.
- [ ] Memilih marker menampilkan detail entitas yang benar.
- [ ] Pengguna dapat menambahkan entitas.
- [ ] Entitas baru tersimpan dan muncul di peta.
- [ ] Pengguna dapat memperbarui entitas.
- [ ] Perubahan atribut dan koordinat tercermin di peta.
- [ ] Pengguna dapat menghapus entitas setelah konfirmasi.
- [ ] Entitas yang dihapus tidak lagi muncul setelah data diperbarui.
- [ ] Data tetap tersedia setelah halaman dimuat ulang.

### Uji validasi

- [ ] Kolom wajib kosong ditolak.
- [ ] Latitude di luar rentang ditolak.
- [ ] Longitude di luar rentang ditolak.
- [ ] Nilai koordinat bukan angka ditolak.
- [ ] Status atau tipe yang tidak diizinkan ditolak.
- [ ] Payload JSON rusak ditangani.
- [ ] ID yang tidak ditemukan menghasilkan respons yang sesuai.

### Uji kegagalan

- [ ] Kegagalan API menampilkan pesan yang jelas.
- [ ] Kegagalan penyimpanan tidak menghasilkan pesan sukses.
- [ ] Kegagalan memuat peta tidak merusak seluruh antarmuka.
- [ ] Pengiriman formulir tidak menyebabkan operasi ganda yang tidak diinginkan.

### Pemeriksaan teknis

- [ ] Pemeriksaan tipe TypeScript berjalan.
- [ ] Linting frontend berjalan jika tersedia.
- [ ] Build frontend berhasil.
- [ ] `gofmt` diterapkan.
- [ ] `go vet` dijalankan jika sesuai.
- [ ] `go test ./...` dijalankan.
- [ ] Backend dapat dikompilasi.
- [ ] README sesuai dengan kondisi aplikasi sebenarnya.

Centang kriteria hanya setelah diverifikasi. Jika ada yang gagal atau belum diuji, tuliskan statusnya secara jelas.

## 14. Dokumentasi dan Hasil Penyerahan

Repositori yang diserahkan setidaknya harus berisi:

- Source code frontend React + TypeScript.
- Source code backend Go.
- Berkas konfigurasi dan contoh konfigurasi tanpa rahasia.
- Skema atau migrasi database jika digunakan.
- Pengujian yang relevan.
- `README.md`.
- `AGENTS.md` atau `CLAUDE.md` jika Agentic AI digunakan.
- Dokumentasi API dan keputusan teknologi jika diperlukan.

README harus menjelaskan:

1. Ringkasan dan fitur aplikasi.
2. Teknologi yang dipilih beserta alasannya.
3. Prasyarat instalasi.
4. Konfigurasi environment.
5. Persiapan database.
6. Cara menjalankan frontend dan backend.
7. Cara menjalankan pengujian.
8. Endpoint dan format API.
9. Aturan validasi.
10. Cara mengonfigurasi penyedia peta.
11. Keterbatasan atau fitur yang belum selesai.
12. Workflow Agentic AI yang benar-benar dilakukan.

Jangan menyatakan fitur yang baru direncanakan sebagai fitur yang sudah tersedia.

## 15. Prioritas Implementasi

Untuk waktu pengerjaan yang terbatas, gunakan urutan berikut.

### P0 - Wajib

1. Model entitas dan validasi.
2. Backend Go dan persistensi.
3. Endpoint CRUD.
4. Frontend React + TypeScript.
5. Peta dan marker.
6. Detail entitas.
7. Alur tambah, ubah, dan hapus.
8. Validasi frontend dan backend.

### P1 - Kualitas minimum

1. Penanganan loading, empty, success, dan error.
2. Pengujian endpoint dan validasi.
3. Pengujian build dan pemeriksaan tipe.
4. README yang dapat diikuti.
5. Dokumentasi penggunaan Agentic AI.

### P2 - Tambahan jika waktu memungkinkan

- Pencarian dan filter.
- Pagination jika jumlah data membutuhkannya.
- Pengelompokan marker.
- Statistik sederhana.
- Pengujian end-to-end tambahan.
- Docker untuk mempermudah setup, jika bermanfaat.

Jangan memulai P2 sebelum P0 berfungsi dan dapat diverifikasi.

## 16. Risiko dan Mitigasi

| Risiko                                    | Dampak                                                       | Mitigasi                                                                  |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Urutan latitude dan longitude tertukar    | Marker muncul di lokasi yang salah                           | Tetapkan konvensi dan uji koordinat                                       |
| Validasi hanya dilakukan di frontend      | Data tidak valid dapat masuk melalui API langsung            | Validasi ulang di backend                                                 |
| UI diperbarui sebelum backend sukses      | Tampilan tidak sesuai dengan data tersimpan                  | Perbarui UI setelah respons sukses atau lakukan rollback state optimistis |
| Konfigurasi peta atau tile tidak tersedia | Peta tidak dapat ditampilkan                                 | Dokumentasikan konfigurasi dan tangani kegagalan secara informatif        |
| Mengandalkan mock data                    | Aplikasi tidak memenuhi kebutuhan persistensi                | Gunakan backend dan penyimpanan nyata untuk alur normal                   |
| Ruang lingkup membesar                    | Fitur wajib tidak selesai                                    | Prioritaskan P0, tunda fitur opsional                                     |
| Dokumentasi tidak sesuai implementasi     | Reviewer tidak dapat menjalankan atau memverifikasi aplikasi | Perbarui README setelah implementasi dan uji instruksinya                 |

## 17. Asumsi dan Keputusan yang Belum Ditentukan

Soal tidak menetapkan beberapa detail berikut. Tentukan dan dokumentasikan pilihan implementasinya:

- Nama produk dan identitas visual.
- Database yang digunakan.
- Pustaka atau penyedia peta.
- Daftar final jenis entitas.
- Daftar final status entitas.
- Bentuk final payload API.
- Apakah pengguna memilih lokasi dengan klik peta atau mengetik koordinat.
- Apakah aplikasi memerlukan autentikasi.
- Target deployment.
- Target kinerja atau volume data.

Untuk versi awal, pilih keputusan yang paling sederhana, mudah dijalankan, mudah diuji, dan tidak memerlukan layanan berbayar tanpa kebutuhan jelas.

## 18. Definisi Selesai (Definition of Done)

Aplikasi siap diserahkan ketika:

- Semua persyaratan fungsional wajib telah diimplementasikan.
- Frontend dan backend dapat dijalankan sesuai dokumentasi.
- Operasi CRUD menggunakan backend dan penyimpanan persisten.
- Entitas valid tampil pada peta dan detailnya dapat dibuka.
- Validasi diterapkan di frontend serta backend.
- Kegagalan ditangani tanpa pesan sukses palsu.
- Pengujian dan pemeriksaan yang tersedia telah dijalankan dan hasilnya dicatat.
- Dokumentasi mencerminkan implementasi yang sebenarnya.
- Fitur yang belum selesai dijelaskan secara terbuka.
- Kandidat memahami dan mampu menjelaskan keputusan teknis utama.

---

**Prinsip utama:** bangun aplikasi yang memenuhi kebutuhan soal secara lengkap, sederhana, dapat dijalankan, dapat diuji, dan dapat dijelaskan. Persyaratan dalam soal harus dibedakan dari rekomendasi desain dan fitur tambahan.
