# AGENTS.md - Instruksi Rekayasa Perangkat Lunak

## 1. Konteks Proyek

Repositori ini berisi aplikasi yang dikembangkan untuk **Take-Home Test Software Developer PT Len Inovasi Teknologi (Len IOT)**.

Aplikasi digunakan untuk mengelola entitas dunia nyata yang memiliki identitas, atribut dasar, status, dan lokasi geografis. Contoh entitas meliputi kendaraan, perangkat IoT, dan lokasi fasilitas.

Aplikasi harus menyediakan antarmuka berbasis peta untuk melihat dan mengelola entitas, didukung oleh API backend dan penyimpanan data persisten.

### Tujuan Utama

1. Memenuhi seluruh persyaratan fungsional dalam soal tes.
2. Membangun aplikasi yang andal, mudah dirawat, aman, dan dapat diuji.
3. Memisahkan tanggung jawab frontend, backend, dan penyimpanan data dengan jelas.
4. Memvalidasi data di frontend maupun backend.
5. Menyediakan dokumentasi yang lengkap dan akurat.
6. Menggunakan Agentic AI secara bertanggung jawab dengan verifikasi manusia atas implementasi dan hasil pengujian.
7. Mengutamakan fungsi yang berjalan dan dapat didemonstrasikan daripada kompleksitas yang tidak diperlukan.

### Teknologi Wajib

- Frontend: React dan TypeScript.
- Backend: Go.
- Penyimpanan data: database atau mekanisme penyimpanan persisten lain yang sesuai.
- Visualisasi geografis: pustaka peta atau penyedia layanan peta yang sesuai.

Database, desain API, pengelolaan state, pendekatan styling, dan pustaka pendukung merupakan keputusan implementasi.

Periksa repositori yang ada sebelum memilih atau mengubah teknologi.

Jangan mengganti teknologi yang sudah digunakan tanpa alasan teknis yang jelas dan persetujuan eksplisit dari pengguna.

---

## 2. Persyaratan Fungsional Wajib

Anggap persyaratan berikut sebagai kriteria penerimaan minimum.

### 2.1 Pengelolaan Entitas

Aplikasi harus mendukung:

- Menampilkan entitas pada peta.
- Menambahkan entitas baru.
- Memperbarui entitas yang sudah ada.
- Menghapus entitas.
- Melihat detail entitas dari antarmuka peta.
- Menyimpan data entitas melalui backend.
- Mengambil data entitas melalui backend.
- Memvalidasi input dan data di frontend serta backend.

### 2.2 Data Entitas

Setiap entitas sebaiknya memiliki model data yang terdefinisi dengan jelas.

Pertimbangkan kolom minimum berikut:

- `id`: Identitas unik entitas.
- `name`: Nama entitas yang mudah dibaca.
- `type`: Kategori entitas, misalnya kendaraan, perangkat IoT, atau fasilitas.
- `status`: Status entitas saat ini.
- `latitude`: Koordinat lintang.
- `longitude`: Koordinat bujur.
- `createdAt`: Waktu pembuatan.
- `updatedAt`: Waktu perubahan terakhir.

Kolom tambahan dapat ditambahkan jika memberi manfaat yang jelas.

Kolom di atas merupakan rekomendasi awal, bukan klaim bahwa setiap kolom diwajibkan secara eksplisit dalam soal.

Gunakan konvensi penamaan yang konsisten pada frontend, kontrak API, dan model backend.

Jika konvensi penamaan frontend berbeda dari backend, tentukan pemetaannya secara eksplisit.

### 2.3 Interaksi Peta

Antarmuka peta sebaiknya mendukung:

- Menampilkan semua entitas yang memiliki koordinat geografis valid.
- Merepresentasikan setiap entitas dengan penanda peta (_marker_).
- Memilih marker untuk melihat detail entitas.
- Membuka antarmuka yang sesuai untuk menambahkan entitas.
- Mengedit entitas yang sudah ada.
- Menghapus entitas dengan konfirmasi yang sesuai.
- Memperbarui tampilan peta setelah operasi CRUD berhasil.
- Menampilkan status memuat, data kosong, dan kesalahan.

Jika koordinat entitas dapat diedit, pastikan marker mengikuti lokasi yang telah diperbarui.

Jangan menganggap perubahan state frontend sebagai bukti bahwa backend telah berhasil menyimpan perubahan.

### 2.4 Persistensi Data

Data entitas harus disimpan dan diambil melalui backend.

Ketentuannya:

- Gunakan penyimpanan persisten untuk penggunaan aplikasi normal.
- Jangan mengandalkan data tiruan (_mock data_) sebagai sumber data utama aplikasi.
- Pastikan operasi tambah, baca, ubah, dan hapus berperilaku konsisten.
- Tangani kegagalan database dengan baik.
- Jangan melaporkan operasi berhasil jika penyimpanan gagal.
- Gunakan migrasi atau mekanisme inisialisasi skema yang dapat diulang jika didukung database yang dipilih.
- Dokumentasikan keterbatasan implementasi penyimpanan yang dipilih.

Data tiruan boleh digunakan untuk pengembangan dan pengujian otomatis, tetapi harus dipisahkan dengan jelas dari perilaku aplikasi normal.

---

## 3. Pemeriksaan Awal Repositori dan Alur Kerja

Sebelum mengimplementasikan fitur, periksa repositori.

Identifikasi:

- Struktur direktori yang ada.
- Konfigurasi frontend.
- Implementasi backend.
- Pengelolaan dependensi.
- Kontrak API yang sudah ada.
- Konfigurasi database dan skema.
- Pengujian yang tersedia.
- Konvensi variabel lingkungan.
- Perintah build dan pengembangan.
- Status Git dan perubahan yang belum di-commit.

Baca berkas sumber yang relevan sebelum mengubahnya.

### Aturan

1. Jangan berasumsi bahwa repositori masih kosong.
2. Jangan menimpa implementasi yang ada tanpa memahami tujuannya.
3. Jangan menghapus perubahan pengguna atau berkas yang tidak terkait.
4. Jangan membuat ulang lockfile tanpa alasan.
5. Jangan memperbarui dependensi tanpa alasan yang jelas.
6. Jangan menambahkan kerangka kerja baru hanya karena sudah familier.
7. Identifikasi persyaratan yang belum terpenuhi sebelum merencanakan perubahan.

Jika repositori kosong, usulkan struktur proyek yang sederhana dan konvensional sesuai kebutuhan penilaian.

Jika informasi penting belum tersedia, nyatakan asumsi dan pilih pendekatan wajar yang paling sederhana.

Minta klarifikasi sebelum mengambil keputusan yang berdampak besar pada ruang lingkup, arsitektur, biaya, keamanan, atau kebutuhan layanan eksternal.

---

## 4. Prinsip Rekayasa Perangkat Lunak

Ikuti prinsip berikut selama pengembangan.

### 4.1 Utamakan Kesederhanaan

Pilih implementasi paling sederhana yang dapat memenuhi kebutuhan secara andal.

Hindari:

- Lapisan abstraksi yang tidak diperlukan.
- Pola desain yang berlebihan.
- Optimasi prematur.
- Arsitektur microservices yang tidak diperlukan.
- Message broker yang tidak dibutuhkan.
- Dependensi yang berlebihan.
- Logika bisnis yang berulang.
- Rekayasa berlebihan untuk kebutuhan hipotetis.

Tambahkan abstraksi jika benar-benar meningkatkan kejelasan, kemudahan pengujian, penggunaan ulang, atau pemeliharaan.

### 4.2 Pemisahan Tanggung Jawab

Pisahkan tanggung jawab secara jelas.

Tanggung jawab frontend:

- Menampilkan antarmuka.
- Mengelola interaksi pengguna.
- Melakukan validasi di sisi klien.
- Memanggil API backend.
- Menampilkan status memuat, berhasil, dan gagal.
- Menampilkan entitas secara geografis pada peta.

Tanggung jawab backend:

- Menentukan kontrak API.
- Memvalidasi dan menormalkan data masuk.
- Menegakkan aturan bisnis.
- Melakukan pemeriksaan otorisasi jika autentikasi diterapkan.
- Mengelola persistensi.
- Mengembalikan respons yang konsisten.
- Menangani kesalahan dengan aman.

Tanggung jawab database:

- Menyimpan data entitas.
- Menegakkan batasan data yang sesuai.
- Menjaga integritas data.
- Mendukung operasi CRUD yang andal.

Jangan menggandakan aturan bisnis yang kompleks di komponen yang tidak berkaitan.

Validasi backend tetap menjadi sumber kebenaran meskipun validasi frontend juga tersedia.

### 4.3 Keterbacaan dan Kemudahan Pemeliharaan

- Gunakan nama yang deskriptif.
- Utamakan fungsi kecil dengan tanggung jawab yang jelas.
- Jaga komponen agar fokus pada satu tanggung jawab.
- Hindari logika kondisional bertingkat terlalu dalam.
- Hindari berkas yang terlalu besar.
- Gunakan tipe yang eksplisit.
- Hapus kode yang tidak digunakan.
- Hindari logika duplikat.
- Gunakan komentar untuk menjelaskan keputusan yang tidak langsung jelas, bukan sintaks yang sudah jelas.
- Ikuti konvensi proyek yang sudah ada.

### 4.4 Keamanan Tipe

Untuk TypeScript:

- Aktifkan dan pertahankan pemeriksaan tipe ketat jika memungkinkan.
- Hindari `any`, kecuali ada alasan yang terdokumentasi dan dapat dibenarkan.
- Utamakan antarmuka atau tipe eksplisit untuk kontrak API.
- Representasikan kolom nullable dan opsional secara akurat.
- Tangani kesalahan bertipe tidak diketahui secara aman.
- Hindari pernyataan tipe (_type assertion_) yang tidak aman.

Untuk Go:

- Gunakan tipe yang eksplisit dan bermakna.
- Tangani kesalahan secara eksplisit.
- Hindari mengabaikan kesalahan.
- Hindari state global yang dapat berubah tanpa kebutuhan.
- Jaga agar setiap paket memiliki tanggung jawab yang jelas.
- Gunakan `context.Context` untuk operasi yang perlu berhenti saat permintaan dibatalkan.
- Gunakan format dan idiom Go standar.

---

## 5. Arsitektur yang Disarankan

Sesuaikan arsitektur dengan repositori dan dependensi yang dipilih.

Contoh struktur:

    project-root/
    ├── AGENTS.md
    ├── README.md
    ├── .gitignore
    ├── .env.example
    ├── frontend/
    │   ├── package.json
    │   ├── src/
    │   │   ├── components/
    │   │   ├── features/
    │   │   │   └── entities/
    │   │   ├── hooks/
    │   │   ├── lib/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── App.tsx
    │   └── tests/
    ├── backend/
    │   ├── go.mod
    │   ├── cmd/
    │   │   └── api/
    │   ├── internal/
    │   │   ├── entity/
    │   │   ├── handler/
    │   │   ├── service/
    │   │   └── repository/
    │   ├── migrations/
    │   └── tests/
    └── docs/

Struktur ini hanya contoh, bukan tata letak direktori yang wajib.

Jangan membuat direktori kosong atau lapisan arsitektur tanpa tujuan praktis.

Untuk aplikasi penilaian yang kecil, struktur lebih sederhana tetap dapat diterima selama tanggung jawabnya jelas.

### Tanggung Jawab Lapisan

- `handler`: Menangani permintaan dan respons HTTP.
- `service`: Mengelola aturan bisnis dan koordinasi kasus penggunaan.
- `repository`: Mengelola operasi persistensi data.
- `entity`: Menyimpan model domain dan validasi terkait.
- `services` pada frontend: Mengelola komunikasi API.
- `features/entities`: Mengelola UI dan alur kerja terkait entitas.
- `components`: Menyediakan komponen UI yang dapat digunakan ulang.
- `types`: Menyediakan definisi tipe frontend.

Jangan membuat abstraksi hanya demi mengikuti contoh struktur ini.

---

## 6. Aturan Pengembangan Frontend

Gunakan React dan TypeScript.

### 6.1 Desain Komponen

- Utamakan komponen fungsional React.
- Gunakan hooks sesuai aturan React.
- Jaga komponen tetap fokus dan berukuran wajar.
- Pisahkan komunikasi API dari presentasi UI.
- Gunakan ulang komponen jika meningkatkan konsistensi.
- Hindari duplikasi state yang tidak diperlukan.
- Gunakan `key` yang stabil saat merender daftar.
- Tangani status memuat dan kesalahan secara eksplisit.

Jangan menempatkan seluruh aplikasi dalam satu komponen besar.

### 6.2 Pengelolaan State

Pilih pengelolaan state berdasarkan kompleksitas nyata.

Untuk aplikasi CRUD kecil, state React dan custom hooks mungkin sudah cukup.

Tambahkan pustaka pengelolaan state khusus hanya jika manfaatnya sepadan dengan kompleksitas tambahan.

Pisahkan secara konseptual data dari server, state formulir, dan state UI sementara.

Setelah mutasi berhasil, pastikan data server yang ditampilkan diperbarui atau dimuat ulang secara konsisten.

### 6.3 Formulir

Formulir entitas harus:

- Menggunakan pengelolaan input yang konsisten.
- Memiliki label yang jelas.
- Memvalidasi kolom wajib.
- Menampilkan pesan validasi pada kolom yang relevan jika sesuai.
- Mencegah pengiriman ganda saat operasi sedang berlangsung.
- Mempertahankan input pengguna saat operasi gagal jika memungkinkan.
- Menampilkan kesalahan validasi dari backend dengan jelas.
- Membedakan kolom opsional dan wajib.

Jangan mengganti nilai yang tidak valid secara diam-diam dengan nilai bawaan yang sembarang.

### 6.4 Status Antarmuka

Sediakan tampilan yang sesuai untuk:

- Pemuatan awal.
- Daftar entitas kosong.
- Kegagalan API.
- Kesalahan validasi formulir.
- Mutasi yang berhasil.
- Mutasi yang gagal.
- Konfigurasi peta yang hilang atau tidak tersedia.
- Koordinat entitas yang tidak valid atau tidak tersedia.

Gunakan teks antarmuka berbahasa Indonesia atau Inggris secara konsisten.

### 6.5 Aksesibilitas dan Responsivitas

- Gunakan HTML semantik.
- Hubungkan label formulir dengan input.
- Berikan nama aksesibel untuk tombol yang hanya menampilkan ikon.
- Pertahankan akses melalui keyboard.
- Gunakan kontras visual yang memadai.
- Jangan hanya mengandalkan warna untuk menyampaikan status.
- Pastikan dialog dapat digunakan secara aksesibel.
- Dukung tata letak desktop dan perangkat seluler yang wajar.

Peta mungkin membutuhkan tata letak berbeda pada layar kecil, tetapi pengelolaan entitas harus tetap dapat digunakan.

### 6.6 Komunikasi API

Pusatkan komunikasi API jika sesuai.

- Gunakan URL dasar API yang dapat dikonfigurasi.
- Tangani kesalahan HTTP secara eksplisit.
- Parse isi respons dengan aman.
- Hindari pengulangan logika permintaan.
- Jangan menanamkan rahasia di kode frontend.
- Hindari endpoint produksi yang ditulis permanen di kode.
- Tangani kegagalan jaringan.
- Cegah respons asinkron yang sudah kedaluwarsa menggantikan state yang lebih baru jika relevan.

Jangan mengasumsikan semua respons HTTP berisi JSON yang valid.

---

## 7. Data Geografis dan Aturan Peta

Data geografis merupakan bagian inti aplikasi.

### 7.1 Validasi Koordinat

Gunakan rentang koordinat berikut:

- Latitude: -90 sampai 90.
- Longitude: -180 sampai 180.

Tolak nilai non-finit, format yang tidak valid, dan koordinat di luar rentang.

Jika koordinat diterima sebagai string, validasi dan ubah ke angka secara eksplisit sebelum digunakan.

Berhati-hatilah terhadap string kosong karena konversi langsung ke angka dapat menghasilkan nilai yang tidak diharapkan.

### 7.2 Urutan Koordinat

Gunakan konvensi yang konsisten di seluruh aplikasi.

Representasi data yang disarankan:

- `latitude`: Posisi utara/selatan.
- `longitude`: Posisi timur/barat.

Saat memanggil pustaka peta, ikuti urutan koordinat yang diharapkan pustaka tersebut.

Sebagai contoh, sebagian API menggunakan `[latitude, longitude]`, sedangkan GeoJSON menggunakan koordinat `[longitude, latitude]`.

Jangan menganggap kedua konvensi tersebut dapat dipertukarkan.

### 7.3 Penyedia Peta

Pilih penyedia atau pustaka peta yang sesuai untuk penilaian.

Pertimbangkan:

- Kemudahan integrasi dengan React.
- Lisensi.
- Persyaratan atribusi.
- Ketersediaan peta dasar.
- Kebutuhan API key.
- Batas permintaan layanan.
- Kebutuhan pengembangan dan demonstrasi.
- Biaya dan ketersediaan layanan.

Jangan berasumsi bahwa sebuah pustaka otomatis menyediakan tile peta atau layanan geocoding.

Jangan memasukkan kredensial privat penyedia peta ke repositori.

Jika penyedia mewajibkan atribusi, tampilkan atribusi tersebut di antarmuka.

Jika layanan peta eksternal tidak tersedia, tampilkan penanganan alternatif yang informatif alih-alih membuat seluruh aplikasi gagal.

### 7.4 Interaksi Marker

- Hubungkan setiap marker dengan entitas yang benar.
- Tampilkan detail yang benar ketika marker dipilih.
- Cegah marker duplikat akibat render berulang.
- Perbarui marker ketika koordinat entitas berubah.
- Hapus marker ketika entitas dihapus.
- Hindari menampilkan entitas dengan koordinat tidak valid.
- Bedakan entitas yang tidak tersedia jika sesuai.

Jika clustering diperkenalkan, pastikan pengguna tetap dapat mengakses detail setiap entitas.

Jangan menambahkan clustering atau analitik geografis lanjutan kecuali benar-benar dibutuhkan.

---

## 8. Aturan Pengembangan Backend

Gunakan Go untuk backend.

### 8.1 API HTTP

Rancang API bergaya REST yang konsisten, kecuali proyek yang sudah ada memiliki pendekatan lain yang dapat dibenarkan.

Contoh kontrak API awal:

    GET    /api/v1/entities
    GET    /api/v1/entities/{id}
    POST   /api/v1/entities
    PUT    /api/v1/entities/{id}
    DELETE /api/v1/entities/{id}

Rute akhir harus sesuai dengan implementasi sebenarnya dan didokumentasikan.

Jangan mengklaim endpoint tersebut tersedia sebelum diimplementasikan dan diuji.

### 8.2 Kode Status HTTP

Gunakan kode status HTTP yang sesuai.

Konvensi umum:

- `200 OK`: Pengambilan atau pembaruan berhasil.
- `201 Created`: Pembuatan sumber daya berhasil.
- `204 No Content`: Penghapusan berhasil tanpa isi respons.
- `400 Bad Request`: Permintaan tidak valid atau format permintaan rusak.
- `404 Not Found`: Sumber daya tidak ditemukan.
- `409 Conflict`: Konflik sumber daya atau keadaan, jika relevan.
- `500 Internal Server Error`: Kegagalan internal server yang tidak terduga.

Gunakan kode status lain jika sesuai dengan kontrak API.

Jangan mengembalikan `200 OK` untuk operasi yang gagal.

### 8.3 Penanganan Permintaan

- Decode permintaan JSON dengan aman.
- Validasi data masuk.
- Tolak payload yang formatnya rusak.
- Hindari menerima data tak terduga tanpa kebijakan yang jelas.
- Batasi ukuran isi permintaan jika sesuai.
- Tetapkan batas waktu permintaan dan eksekusi yang wajar.
- Gunakan `context.Context` untuk operasi yang perlu berhenti ketika permintaan dibatalkan.
- Kembalikan format kesalahan yang konsisten.
- Hindari membocorkan stack trace atau detail database internal.

### 8.4 Logika Bisnis

Pisahkan aturan bisnis dari handler HTTP jika lapisan service benar-benar meningkatkan kejelasan.

Teruskan kesalahan secara jelas.

Jangan mengabaikan kesalahan repository atau database.

Pastikan operasi ubah dan hapus dapat membedakan data yang tidak ditemukan dari kegagalan internal.

### 8.5 Operasi Database

- Gunakan kueri berparameter atau ORM yang sesuai.
- Hindari penggabungan string SQL dengan input yang tidak tepercaya.
- Terapkan batasan database jika sesuai.
- Tentukan batas transaksi dengan sengaja.
- Hindari kueri database yang tidak diperlukan.
- Tutup sumber daya dengan benar.
- Hindari pencatatan kredensial atau informasi database sensitif.
- Buat inisialisasi database dapat diulang secara konsisten.

Pilih database sesuai cakupan yang diharapkan.

Database relasional merupakan pilihan awal yang wajar untuk CRUD entitas, tetapi keputusan akhir harus sesuai kebutuhan proyek dan lingkungan.

### 8.6 Konfigurasi

Gunakan variabel lingkungan untuk konfigurasi yang berbeda antarlingkungan.

Contohnya:

- Pengaturan koneksi database.
- Alamat dan port backend.
- URL dasar API frontend.
- Konfigurasi layanan peta eksternal.
- Kredensial layanan lain jika diperlukan.

Sediakan `.env.example` berisi placeholder dan deskripsi.

Jangan pernah melakukan commit terhadap kredensial yang sebenarnya.

Jangan mencatat rahasia ke log.

---

## 9. Strategi Validasi

Validasi harus tersedia di frontend dan backend.

Validasi frontend meningkatkan kemudahan penggunaan.

Validasi backend melindungi integritas data dan tetap menjadi sumber kebenaran utama.

### 9.1 Validasi Entitas

Validasi setidaknya:

- Kolom wajib tersedia.
- String wajib tidak kosong setelah spasi di awal dan akhir dihapus.
- Tipe kolom sesuai.
- Koordinat merupakan angka valid.
- Latitude dan longitude berada dalam rentang yang diizinkan.
- Nilai status termasuk dalam daftar yang ditentukan aplikasi.
- Identitas entitas ditangani secara konsisten.
- Tipe entitas yang tidak dikenal ditolak jika menggunakan daftar tipe terbatas.
- Ukuran input berada dalam batas yang wajar.
- Permintaan pembaruan tidak merusak data yang sudah ada secara diam-diam.

Definisikan tipe entitas dan status yang diperbolehkan secara eksplisit.

Hindari perbedaan aturan yang tidak disengaja antara frontend dan backend.

### 9.2 Kesalahan Validasi

Kembalikan pesan kesalahan yang dapat ditindaklanjuti dan tidak mengungkapkan informasi sensitif.

Jika berguna, identifikasi kolom yang gagal divalidasi.

Jangan mengekspos detail internal database kepada pengguna.

Dokumentasikan perbedaan antara validasi frontend dan validasi yang ditegakkan backend.

---

## 10. Praktik Keamanan

Terapkan langkah keamanan sesuai cakupan aplikasi.

### 10.1 Keamanan Input dan Data

- Perlakukan semua data masuk sebagai data yang tidak tepercaya.
- Validasi input yang relevan di backend.
- Gunakan operasi database berparameter.
- Hindari pola deserialisasi yang tidak aman.
- Jangan mengekspos kesalahan internal.
- Jaga dependensi agar tetap diperbarui secara wajar.
- Jangan menyimpan rahasia dalam kode sumber.
- Jangan melakukan commit terhadap berkas `.env` yang berisi kredensial sebenarnya.

### 10.2 Keamanan HTTP dan Browser

- Konfigurasikan CORS untuk origin frontend yang dituju.
- Hindari kebijakan CORS tanpa pembatasan tanpa alasan yang jelas.
- Terapkan batas waktu permintaan dan batas ukuran isi yang wajar.
- Hindari injeksi HTML yang tidak aman.
- Hindari merender konten tidak tepercaya sebagai markup yang dapat dieksekusi.
- Konfigurasikan HTTPS untuk lingkungan deployment jika sesuai.

CORS bukan mekanisme autentikasi atau otorisasi.

### 10.3 Operasi yang Menghapus Data

- Minta konfirmasi sebelum penghapusan di antarmuka.
- Pastikan backend benar-benar menjalankan penghapusan yang diminta.
- Kembalikan kesalahan yang sesuai jika data tidak ditemukan.
- Hindari menghapus data sebagai efek samping dari operasi yang tidak berkaitan.

### 10.4 Autentikasi dan Otorisasi

Jangan mengarang persyaratan autentikasi yang tidak terdapat dalam soal.

Jika autentikasi ditambahkan, lakukan pemeriksaan otorisasi di backend.

Jangan hanya mengandalkan perlindungan rute frontend untuk mengamankan sumber daya backend.

Dokumentasikan apakah autentikasi diterapkan atau sengaja tidak disertakan.

---

## 11. Persyaratan Pengujian

Pengujian harus memverifikasi perilaku yang dapat diamati, bukan sekadar keberadaan kode.

Jangan menyatakan pengujian berhasil kecuali benar-benar dijalankan dan hasilnya diamati.

### 11.1 Pengujian Backend

Uji perilaku penting backend, termasuk:

- Pembuatan entitas.
- Pengambilan daftar entitas.
- Pengambilan detail entitas.
- Pembaruan entitas.
- Penghapusan entitas.
- Pengambilan entitas yang tidak ditemukan.
- JSON tidak valid.
- Kolom wajib yang tidak tersedia.
- Nilai koordinat tidak valid.
- Koordinat di luar rentang.
- Status atau tipe yang tidak valid.
- Kegagalan persistensi jika memungkinkan.
- Kode status HTTP yang sesuai.
- Format respons kesalahan yang konsisten.

Gunakan paket standar `testing` Go jika sesuai.

Gunakan `httptest` untuk pengujian handler HTTP jika berguna.

Gunakan data pengujian terisolasi dan hindari mengubah database pengembangan atau produksi secara tidak sengaja.

### 11.2 Pengujian Frontend

Uji perilaku UI yang relevan, termasuk:

- Menampilkan entitas.
- Validasi formulir.
- Menambahkan entitas.
- Mengedit entitas.
- Menghapus entitas.
- Menampilkan detail entitas.
- Menangani kesalahan API.
- Menangani status memuat dan data kosong.
- Memperbarui antarmuka setelah perubahan berhasil.
- Menampilkan atau menangani marker peta dengan benar.

Gunakan alat pengujian yang sudah tersedia di repositori jika sesuai.

Jangan menambahkan kerangka kerja pengujian besar hanya untuk sejumlah kecil pengujian sederhana.

### 11.3 Pengujian Integrasi

Jika memungkinkan, verifikasi alur data secara menyeluruh:

1. Pengguna mengirim formulir entitas.
2. Frontend mengirim permintaan ke backend.
3. Backend memvalidasi permintaan.
4. Backend menyimpan entitas.
5. Backend mengembalikan hasil.
6. Frontend menampilkan entitas yang tersimpan.
7. Entitas tetap tersedia setelah aplikasi dimuat ulang.

Lakukan pemeriksaan serupa untuk pembaruan dan penghapusan.

### 11.4 Pemeriksaan Kualitas

Jalankan perintah yang sesuai dan didukung repositori.

Frontend:

- Pemeriksaan tipe TypeScript.
- Linting.
- Pengujian unit.
- Build produksi.

Backend:

- Pemeriksaan format `gofmt`.
- Pemeriksaan statis `go vet`.
- Pengujian `go test ./...`.
- Pemeriksaan kompilasi atau build.

Gunakan perintah yang benar-benar tersedia dalam repositori.

Jangan berasumsi suatu perintah tersedia sebelum memeriksa `package.json`, `go.mod`, atau konfigurasi terkait.

Jika perintah tidak dapat dijalankan, laporkan keterbatasan yang sebenarnya, bukan mengklaim keberhasilan.

---

## 12. Kontrak API dan Konsistensi Data

Jaga agar kontrak frontend dan backend konsisten.

Dokumentasikan:

- Rute endpoint.
- Metode HTTP.
- Payload permintaan.
- Payload respons.
- Aturan validasi.
- Format kesalahan.
- Kode status.
- Definisi kolom entitas.
- Konvensi koordinat.

Gunakan representasi yang konsisten untuk tanggal, identitas, status, dan koordinat.

Jika kontrak API berubah, perbarui frontend, pengujian backend, dan dokumentasi terkait.

Hindari definisi skema API yang duplikat dan saling bertentangan.

Jika spesifikasi OpenAPI ditambahkan, jaga agar tetap sesuai dengan implementasi sebenarnya.

Jangan membuat dokumen OpenAPI hanya untuk tampilan jika tidak akan dipelihara.

---

## 13. Pengalaman Pengguna dan Kualitas Antarmuka

Aplikasi harus mudah dipahami oleh pengguna baru.

Prioritaskan:

- Tata letak yang berpusat pada peta.
- Informasi entitas yang mudah dibaca.
- Tombol tambah, edit, dan hapus yang jelas.
- Cara yang mudah untuk membuka detail entitas.
- Label formulir yang mudah dipahami.
- Indikator status yang konsisten.
- Umpan balik setelah operasi.
- Tata letak responsif.
- Kontrol yang aksesibel.
- Tampilan data kosong dan kesalahan yang informatif.

Hindari efek visual yang tidak perlu dan mengganggu penggunaan.

Gunakan jarak, tipografi, dan gaya komponen yang konsisten.

Jika proyek sudah memiliki sistem desain atau pustaka komponen, gunakan kembali jika sesuai.

Jangan mengorbankan kebenaran fungsi demi tampilan visual.

---

## 14. Alur Kerja Agentic AI

Agen AI merupakan asisten, bukan sumber kebenaran yang tidak perlu diverifikasi.

Gunakan alur kerja berikut untuk tugas yang substansial.

### Tahap 1 - Memahami

- Baca berkas sumber yang relevan.
- Identifikasi persyaratan yang terdampak.
- Pahami arsitektur saat ini.
- Identifikasi dependensi dan batasan.
- Tentukan cara memverifikasi perubahan.

### Tahap 2 - Merencanakan

- Jelaskan implementasi yang diusulkan.
- Identifikasi berkas dan komponen yang terdampak.
- Pertimbangkan kasus tepi yang relevan.
- Identifikasi risiko dan dampak terhadap kompatibilitas.
- Jaga agar implementasi tetap terfokus.

Untuk perubahan kecil dengan risiko rendah, rencana singkat sudah cukup.

Jangan membuat dokumen perencanaan yang tidak diperlukan untuk perubahan sepele.

### Tahap 3 - Mengimplementasikan

- Lakukan perubahan yang terfokus.
- Ikuti konvensi proyek.
- Pertahankan perilaku yang tidak terkait.
- Hindari refaktor yang tidak berkaitan.
- Jaga agar kontrak frontend dan backend tetap selaras.
- Perbarui pengujian jika diperlukan.

### Tahap 4 - Memverifikasi

- Periksa hasil perubahan.
- Jalankan pengujian otomatis yang relevan.
- Jalankan pemeriksaan tipe, linting, atau build jika tersedia.
- Tinjau penanganan kesalahan.
- Periksa kemungkinan rahasia atau perubahan konfigurasi yang tidak disengaja.
- Pastikan implementasi memenuhi persyaratan.

### Tahap 5 - Melaporkan

Ringkas:

- Hal yang telah diimplementasikan.
- Berkas yang diubah.
- Pengujian dan pemeriksaan yang benar-benar dijalankan.
- Pemeriksaan yang berhasil atau gagal.
- Keterbatasan yang diketahui.
- Pekerjaan yang masih tersisa.

Bedakan perilaku yang sudah diverifikasi dari asumsi.

Jangan mengklaim kode telah diuji, berjalan, di-deploy, atau siap produksi tanpa bukti yang memadai.

### Tanggung Jawab Manusia

Kandidat tetap bertanggung jawab untuk meninjau, memahami, menguji, dan menjelaskan implementasi yang dikirimkan.

Jangan mengirimkan kode hanya karena kode tersebut dihasilkan oleh AI.

Kandidat harus mampu menjelaskan keputusan arsitektur penting, alur data, aturan validasi, penanganan kesalahan, dan hasil pengujian.

---

## 15. Aturan Operasional Agen AI

Saat menggunakan agen coding AI:

1. Baca berkas ini sebelum melakukan perubahan kode yang substansial.
2. Periksa berkas yang relevan sebelum mengedit.
3. Ikuti konvensi repositori kecuali bertentangan dengan persyaratan eksplisit.
4. Utamakan perubahan minimal dan terarah.
5. Jangan mengarang berkas, perintah, dependensi, atau perilaku API.
6. Jangan mengklaim telah memeriksa berkas yang sebenarnya belum diperiksa.
7. Jangan mengklaim telah menjalankan perintah yang sebenarnya belum dijalankan.
8. Jangan membuat hasil pengujian palsu.
9. Jangan menyembunyikan keterbatasan implementasi.
10. Jangan menghapus fitur yang berfungsi tanpa alasan.
11. Jangan menulis ulang berkas yang tidak terkait.
12. Jangan menekan atau mengabaikan kesalahan hanya agar build terlihat berhasil.
13. Jangan menonaktifkan pengujian atau pemeriksaan tipe untuk menghindari kegagalan.
14. Jangan memasukkan respons tiruan ke perilaku normal aplikasi tanpa keputusan desain yang eksplisit.
15. Jangan mengubah skema database atau kontrak API secara diam-diam.
16. Jangan melakukan commit, push, deployment, atau operasi destruktif tanpa izin jika tindakan tersebut memiliki dampak eksternal yang berarti.
17. Jangan mengekspos variabel lingkungan, kredensial, token, atau rahasia lain di log maupun dokumentasi.
18. Minta klarifikasi jika keputusan berdampak material pada ketepatan atau cakupan.
19. Utamakan solusi yang deterministik dan dapat direproduksi.
20. Laporkan masalah yang belum terselesaikan secara jujur.

Jangan menjalankan perintah shell destruktif, reset database, atau penghapusan berkas secara luas tanpa memahami dampaknya.

Jangan menimpa perubahan pengguna di working tree.

---

## 16. Pengelolaan Dependensi

Sebelum menambahkan dependensi:

- Periksa apakah fungsi yang dibutuhkan sudah tersedia dalam proyek.
- Evaluasi apakah dependensi benar-benar diperlukan.
- Pertimbangkan status pemeliharaan dan kompatibilitas.
- Pertimbangkan lisensi dan implikasi keamanan.
- Utamakan pustaka mapan dengan tujuan yang jelas.
- Hindari dependensi yang menggandakan fungsi yang sudah tersedia.

Saat menambahkan dependensi:

- Jelaskan tujuannya jika relevan dengan dokumentasi keputusan arsitektur.
- Gunakan package manager yang sudah digunakan proyek.
- Perbarui lockfile melalui package manager.
- Pastikan aplikasi tetap dapat di-build dan diuji.

Jangan memperbarui paket yang tidak terkait hanya untuk mendapatkan versi terbaru.

Jangan menganggap dependensi aman hanya karena populer.

---

## 17. Logging dan Penanganan Kesalahan

Gunakan logging yang berguna dan terstruktur jika sesuai.

Log harus membantu mendiagnosis kegagalan tanpa mengekspos informasi sensitif.

Sertakan konteks operasional yang relevan, seperti:

- Jenis operasi.
- Identitas permintaan atau korelasi jika tersedia.
- Kategori kesalahan.
- Identitas sumber daya yang tidak sensitif.

Hindari mencatat:

- Kata sandi.
- Rahasia API.
- Token akses.
- Kredensial database.
- Seluruh isi variabel lingkungan.
- Data pengguna sensitif yang tidak diperlukan.

Kembalikan pesan kesalahan kepada pengguna yang menjelaskan masalah dan, jika memungkinkan, cara mengatasinya.

Simpan detail diagnostik internal pada log server yang sesuai.

Jangan mengabaikan kesalahan atau mengembalikan pesan sukses yang menyesatkan.

---

## 18. Kinerja dan Keandalan

Terapkan praktik kinerja yang wajar untuk cakupan aplikasi.

- Hindari permintaan API berulang yang tidak diperlukan.
- Hindari render ulang React yang tidak diperlukan jika berdampak nyata.
- Pastikan pembaruan marker konsisten dengan data entitas.
- Gunakan indeks database jika pola kueri membenarkannya.
- Terapkan batas waktu permintaan.
- Tangani layanan eksternal yang tidak tersedia dengan baik.
- Hindari memuat data besar yang tidak diperlukan jika volume data membenarkan pagination.
- Cegah pengiriman ganda jika memungkinkan.
- Pastikan indikator memuat tidak terus tampil setelah kegagalan.

Jangan menambahkan caching kompleks, pemrosesan terdistribusi, atau optimasi prematur.

Jika pagination atau strategi pemuatan data lain diterapkan, pastikan peta dan daftar entitas merepresentasikan kumpulan data yang dimaksud secara konsisten.

---

## 19. Lingkungan dan Pengembangan Lokal

Proyek harus mudah dijalankan secara lokal.

Dokumentasikan:

- Perangkat lunak dan versi yang dibutuhkan.
- Langkah instalasi.
- Konfigurasi variabel lingkungan.
- Inisialisasi database.
- Migrasi atau pembuatan skema.
- Cara menjalankan frontend.
- Cara menjalankan backend.
- Perintah pengujian.
- Perintah build produksi.
- Langkah pemecahan masalah.

Jika Docker digunakan, sediakan konfigurasi yang dapat direproduksi dan jelaskan cara menjalankan serta menghentikan layanan.

Jangan mewajibkan Docker jika implementasi sebenarnya tidak bergantung padanya.

Pastikan rahasia disediakan melalui konfigurasi lokal, bukan berkas yang di-commit.

Hindari ketergantungan pada path khusus mesin yang tidak didokumentasikan.

---

## 20. Persyaratan Dokumentasi

Pelihara `README.md` yang berguna.

README sebaiknya menjelaskan:

1. Ringkasan proyek.
2. Masalah yang diselesaikan.
3. Fitur.
4. Teknologi yang digunakan.
5. Arsitektur.
6. Struktur repositori.
7. Prasyarat.
8. Instalasi.
9. Konfigurasi lingkungan.
10. Inisialisasi database.
11. Cara menjalankan backend.
12. Cara menjalankan frontend.
13. Cara menjalankan pengujian.
14. Endpoint API.
15. Aturan validasi.
16. Penyedia dan konfigurasi peta.
17. Keterbatasan yang diketahui.
18. Alur kerja pengembangan berbantuan AI.
19. Fitur yang belum selesai.

Dokumentasikan alasan pemilihan pustaka dan teknologi yang penting.

Jelaskan keputusan implementasi yang benar-benar diambil, bukan sekadar mencantumkan dependensi tanpa alasan.

Jika ada fitur yang belum selesai, jelaskan:

- Bagian yang belum selesai.
- Bagian yang sudah berfungsi.
- Bagian yang belum berfungsi.
- Alasan belum selesai jika diketahui.
- Pekerjaan yang diperlukan untuk menyelesaikannya.

Jangan mendokumentasikan fitur yang baru direncanakan seolah-olah sudah diterapkan.

### Dokumentasi Penggunaan AI

Jelaskan secara akurat bagaimana Agentic AI digunakan.

Bedakan antara:

- Kode atau konfigurasi yang dihasilkan AI.
- Kode yang diubah dengan bantuan AI.
- Keputusan yang dibuat kandidat.
- Pengujian yang benar-benar dijalankan.
- Hasil yang diverifikasi secara manual oleh kandidat.

Jangan mengarang riwayat penggunaan AI atau mengklaim verifikasi manusia yang tidak dilakukan.

---

## 21. Git dan Pengelolaan Perubahan

Pastikan perubahan mudah ditinjau.

- Gunakan pesan commit yang bermakna.
- Hindari melakukan commit terhadap artefak hasil build kecuali diperlukan.
- Kecualikan rahasia, database lokal, dan keluaran build yang tidak diperlukan.
- Sesuaikan `.gitignore` dengan teknologi yang digunakan.
- Hindari perubahan format yang tidak terkait.
- Tinjau `git diff` sebelum melakukan commit.
- Pastikan dokumentasi sesuai dengan kode yang dikirim.
- Hindari kerangka pengujian yang gagal atau menyesatkan.

Jangan melakukan commit atau push secara otomatis kecuali diminta secara eksplisit.

Jangan mengubah riwayat Git atau melakukan force-push tanpa izin eksplisit.

---

## 22. Definisi Selesai

Sebuah fitur dianggap selesai hanya jika kriteria yang relevan terpenuhi.

### Kebenaran Fungsional

- Perilaku yang dimaksud telah diimplementasikan.
- Kasus tepi yang relevan telah dipertimbangkan.
- Perilaku frontend dan backend konsisten.
- Persistensi data berfungsi jika diwajibkan.
- Kesalahan ditangani dengan tepat.

### Kualitas Kode

- Kode mengikuti konvensi proyek.
- Tipe dan antarmuka konsisten.
- Duplikasi yang tidak diperlukan dihindari.
- Tidak ada perubahan tidak terkait.
- Tidak ada kesalahan yang sengaja disembunyikan.

### Pengujian

- Pengujian relevan telah ditambahkan atau diperbarui.
- Pemeriksaan yang sesuai telah dijalankan.
- Hasil dilaporkan secara akurat.
- Perilaku yang belum diverifikasi diidentifikasi.

### Dokumentasi

- Dokumentasi setup atau API yang relevan telah diperbarui.
- Kebutuhan konfigurasi didokumentasikan.
- Keterbatasan diungkapkan.

### Tinjauan Akhir

- Perubahan akhir telah ditinjau.
- Tidak ada rahasia yang tidak sengaja disertakan.
- Tidak ada perubahan destruktif atau tidak terkait yang tertinggal.
- Kandidat dapat menjelaskan implementasinya.

Jangan menyatakan fitur sepenuhnya selesai jika bagian wajib masih belum diimplementasikan atau belum diverifikasi.

---

## 23. Prioritas Penilaian

Jika waktu terbatas, prioritaskan pekerjaan dengan urutan berikut.

### Prioritas 1 - Fungsi Wajib

- Frontend React dan TypeScript.
- Backend Go.
- Penyimpanan entitas secara persisten.
- Menampilkan entitas pada peta.
- Membuat, membaca, memperbarui, dan menghapus entitas.
- Melihat detail entitas.
- Validasi frontend dan backend.

### Prioritas 2 - Keandalan

- Kontrak API yang konsisten.
- Penanganan koordinat yang benar.
- Penanganan kesalahan.
- Integritas data.
- Status memuat dan data kosong.
- Pengujian otomatis untuk fungsi kritis.

### Prioritas 3 - Kualitas Pengumpulan

- README yang jelas.
- Setup lokal yang dapat diulang.
- Alasan pemilihan teknologi yang terdokumentasi.
- Dokumentasi alur kerja AI yang akurat.
- Repositori Git yang rapi.
- Pengungkapan fitur yang belum selesai secara eksplisit.

### Prioritas 4 - Peningkatan Opsional

Pertimbangkan fitur tambahan hanya setelah semua persyaratan wajib berfungsi dengan andal.

Peningkatan yang mungkin meliputi:

- Pencarian entitas.
- Filter berdasarkan tipe atau status.
- Pagination.
- Pengelompokan marker.
- Statistik entitas.
- Pengujian integrasi yang lebih lengkap.
- Pengembangan berbasis Docker.
- Dokumentasi skema API.

Fitur-fitur ini bersifat opsional kecuali proyek secara eksplisit menetapkannya sebagai persyaratan.

Jangan mengorbankan fungsi wajib demi fitur tambahan.

---

## 24. Instruksi Akhir

Bertindaklah sebagai asisten rekayasa perangkat lunak yang teliti.

Pahami persyaratan sebelum mengubah kode.

Utamakan implementasi yang sederhana dan mudah dirawat.

Verifikasi asumsi.

Jaga konsistensi frontend, backend, database, dan dokumentasi.

Verifikasi hasil melalui pengujian dan pemeriksaan nyata.

Laporkan keterbatasan dengan jujur.

Jangan mengarang detail implementasi, hasil pengujian, atau fitur yang telah selesai.

Tujuan akhirnya adalah menghasilkan aplikasi yang berfungsi, mudah dipahami, dapat dijalankan ulang, dan terdokumentasi secara profesional sesuai Take-Home Test Software Developer PT Len Inovasi Teknologi.
