# Len IOT - Geospatial Operations

Dashboard manajemen entitas geografis untuk memantau kendaraan, perangkat IoT, dan fasilitas. Frontend React + TypeScript menggunakan Tailwind CSS v4 untuk utility styling serta komponen lokal bergaya shadcn/ui; Leaflet/OpenStreetMap menyediakan peta, dan backend Go menyimpan data ke SQLite lokal.

## Fitur

- Peta interaktif Indonesia, marker status, tooltip, zoom, dan fokus pada entitas.
- Ringkasan KPI total, aktif, perhatian, offline, dihitung dari data backend.
- Daftar entitas dengan pencarian, filter status, pagination, dan koordinat.
- CRUD melalui REST API; form memvalidasi input, hapus meminta konfirmasi.
- Penyimpanan persisten SQLite dan inisialisasi skema otomatis.
- Keadaan loading, kosong, error/retry, pesan sukses, dan status koneksi backend.

## Struktur proyek

```text
backend/
├── cmd/api/                 # Entry point dan wiring dependensi
└── internal/
    ├── handler/             # HTTP routes, request/response, CORS
    ├── model/               # Model domain dan validasi
    └── store/               # Kontrak repository dan implementasi SQLite
frontend/src/
├── components/              # Komponen layout dan UI reusable
├── features/entities/       # Komponen fitur entitas dan konstanta domain UI
├── hooks/                   # State dan perilaku entitas/filter
├── lib/                     # Validasi frontend dan utilitas
├── services/                # Klien REST API
└── types/                   # Tipe kontrak frontend
```

Backend mengikuti pemisahan handler → repository/storage → model; `cmd/api` menjadi composition root untuk inisialisasi dan dependency wiring. Frontend memakai custom hooks untuk alur data/state, lalu komponen fitur untuk UI. Pola ini menjaga komponen presentasional tidak mengakses SQL atau mengelola komunikasi HTTP secara langsung.

## Persyaratan

- Go 1.26 atau lebih baru (sesuai deklarasi `backend/go.mod`).
- Node.js 20 atau lebih baru dan npm.
- Koneksi internet untuk tile OpenStreetMap dan font Google. Backend dan frontend tidak menyediakan fallback peta offline.

## Menjalankan lokal

### Backend

```sh
cd backend
go run ./cmd/api
```

Default API di `http://localhost:8080`; database dibuat otomatis di `backend/data/entities.db` saat dijalankan dari folder backend.

Variabel opsional:

- `API_ADDR`: alamat HTTP, default `:8080`.
- `DATABASE_PATH`: path file SQLite, default `./data/entities.db` relatif ke direktori kerja backend.
- `FRONTEND_ORIGIN`: satu origin browser yang diizinkan CORS, default `http://localhost:5173`.

### Frontend

```sh
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. URL API dapat diatur lewat `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Tile peta menggunakan layanan publik OpenStreetMap dengan atribusi di peta. Ketersediaan tile tunduk pada kebijakan dan kapasitas layanan OpenStreetMap; jangan gunakan untuk trafik produksi tinggi tanpa penyedia tile yang sesuai.

## API

Semua endpoint menggunakan JSON kecuali `DELETE` berhasil (204 tanpa body). Entitas berisi `id`, `name`, `type`, `status`, `latitude`, `longitude`, `createdAt`, dan `updatedAt`.

| Method | Endpoint                | Hasil                      |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/v1/health`        | `{ "status": "ok" }`       |
| GET    | `/api/v1/entities`      | Daftar entitas, `200`      |
| GET    | `/api/v1/entities/{id}` | Detail atau `404`          |
| POST   | `/api/v1/entities`      | Buat entitas, `201`        |
| PUT    | `/api/v1/entities/{id}` | Perbarui atau `404`, `200` |
| DELETE | `/api/v1/entities/{id}` | Hapus, `204` atau `404`    |

Payload create/update: `name`, `type`, `status`, `latitude`, `longitude`. Tipe: `vehicle`, `iot_device`, `facility`. Status: `active`, `warning`, `offline`. Nama wajib setelah trim dan maksimal 120 karakter. Latitude valid pada rentang -90..90; longitude -180..180. Backend menolak JSON rusak dan properti asing. Koordinat disimpan sebagai `latitude`/`longitude`; Leaflet menerima marker `[latitude, longitude]`.

Error API berbentuk `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "latitude": "..." } } }`.

## Tes dan build

```sh
cd backend && go test ./... && go vet ./...
cd frontend && npm test && npm run build
```

Tes frontend mencakup validasi input, lifecycle state/API di hook, filter/pencarian/pagination, dan alur dashboard create/update/delete/detail/error.

Verifikasi terakhir pada 2 November 2026: `go test ./...`, `go vet ./...`, `npm test` (18 tes), dan `npm run build` berhasil. Smoke test HTTP API sebelumnya pada database terisolasi memverifikasi health, create (`201`), read (`200`), update (`200`), delete (`204`), daftar kosong setelah penghapusan, dan penolakan koordinat di luar rentang (`400`).

### Batasan verifikasi

Tes UI memakai jsdom dan Leaflet yang dimock; belum menjalankan browser nyata. Tile OpenStreetMap, refresh lintas sesi terhadap database, dan visual layout nyata di berbagai ukuran layar belum diverifikasi browser end-to-end. Gunakan browser manual untuk pemeriksaan akhir.

## Pilihan teknis dan batasan

- UI dashboard menggunakan Tailwind CSS v4 utilities dan komponen lokal bergaya shadcn/ui (Button, Card, Badge, Input, Select, Dialog). `components.json`, alias `@/`, dan helper `cn` mendukung konsistensi komponen. Peta Leaflet tetap memakai CSS Leaflet yang diperlukan pustaka.
- SQLite dipilih agar persisten dan mudah dijalankan lokal tanpa layanan database terpisah. File database tidak cocok untuk deployment multi-instance tanpa rancangan penyimpanan bersama/operasional tambahan.
- Leaflet dan tile OpenStreetMap dipilih untuk peta web tanpa API key. Tile memerlukan internet dan atribusi; geocoding dan tile offline tidak disediakan.
- Belum ada autentikasi, real-time telemetry, audit log, tes browser end-to-end, Docker, atau deployment. Tes komponen UI tersedia dan menguji alur utama dengan Leaflet dimock. Rute UI pengaturan/bantuan hanya placeholder.
- Data demo hanya boleh disimpan dengan menambahkan lewat formulir; aplikasi tidak menggunakan hardcoded mock sebagai sumber data. Saat backend tidak tersedia, UI menampilkan error dan tidak mengarang data.
- Backend tidak menyediakan autentikasi/otorisasi; jalankan hanya pada lingkungan tepercaya dan jangan mengekspos langsung ke internet tanpa kontrol akses yang sesuai.

## Penggunaan Agentic AI

Implementasi awal, dokumentasi, dan pengujian disusun dengan bantuan Agentic AI berdasarkan `AGENTS.md` dan `docs/PRD.md`. Pilihan teknologi mengikuti kebutuhan MVP dan lingkungan repositori. Perintah verifikasi hanya dilaporkan setelah dijalankan; kandidat tetap harus meninjau kode dan menguji UI serta alur aplikasi secara manual.
