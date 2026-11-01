# PRD Generator

Aplikasi web untuk membuat Product Requirements Document (PRD) secara otomatis dengan AI. Isi form singkat, Gemini menulis PRD lengkap dalam bahasa Indonesia, lalu Anda bisa mengedit dan mengekspornya.

## Fitur

- Generate PRD 14 bagian, termasuk **Technical Plan** dan **Implementation Tasks** yang siap dieksekusi agent coding.
- Pilihan template gaya PRD (Standar, Startup, Enterprise).
- Streaming respons secara real-time via Server-Sent Events (SSE).
- Edit judul dan konten PRD langsung di browser.
- **AI Refine per Section**: perbaiki atau perkaya spesifik section dengan instruksi khusus tanpa generate ulang seluruh dokumen.
- **Riwayat Versi & Rollback**: simpan snapshot otomatis saat regenerate/refine, dan pulihkan ke versi sebelumnya dengan 1-klik.
- **Tautan Publik (Share Link)**: bagikan PRD sebagai dokumen read-only tanpa login via `/share/[id]`.
- Export ke Markdown (.md), PDF, dan DOCX.
- Autentikasi email/password (NextAuth).
- Dashboard dengan pencarian debounce dan pagination.
- Rate limiting persisten berbasis database (20 generate/jam).

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Prisma + MySQL
- NextAuth (credentials)
- Google Gemini (`@google/generative-ai`)
- jsPDF & docx untuk export

## Prasyarat

- Node.js 20.9+
- MySQL 8 (atau MariaDB kompatibel)
- API key Gemini dari [Google AI Studio](https://aistudio.google.com/apikey)

## Setup

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat file `.env` di root proyek:

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/prd_generator"
   NEXTAUTH_SECRET="ganti-dengan-string-acak"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="api-key-anda"
   ```

   Buat secret dengan `openssl rand -base64 32`, atau di PowerShell:
   `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`

3. Buat database dan jalankan migrasi:

   ```bash
   npx prisma migrate deploy
   ```

   Untuk pengembangan yang mengubah schema, gunakan `npm run db:migrate`.

4. Jalankan development server:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

## Script

| Perintah | Fungsi |
| -------- | ------ |
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm test` | Unit test (Node test runner) |
| `npm run db:migrate` | Buat/terapkan migrasi Prisma (dev) |
| `npm run db:deploy` | Terapkan migrasi (production) |
| `npm run db:push` | Sinkronisasi schema tanpa migrasi (khusus prototipe) |
| `npm run db:studio` | Buka Prisma Studio |

## Struktur

```
prisma/schema.prisma      Model User & Prd
src/lib/gemini.ts         Prompt dan pemanggilan Gemini
src/lib/auth.ts           Konfigurasi NextAuth
src/app/api/              Endpoint register, generate, dan CRUD PRD
src/app/dashboard/        Daftar PRD
src/app/prd/new/          Form generate PRD
src/app/prd/[id]/         Lihat, edit, dan export PRD
```

## Catatan

- Generate dibatasi **20 kali per jam per pengguna** (persisten di tabel database `RateLimit`).
- Batas panjang input divalidasi di server: judul 200 karakter, konten 200.000 karakter.
- Model Gemini dicoba berurutan (`gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-flash-latest`) dengan fallback saat error sementara.
