# Portfolio Jessen William

Website portfolio pribadi. Next.js 16 (App Router), React 19, TypeScript, tanpa UI library dan tanpa library animasi. Semua halaman di-render statis waktu build, jadi di Vercel cepat dan murah.

## Jalanin di laptop

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Buat cek versi production:

```bash
npm run build
npm start
```

## Ganti isi

Semua teks ada di dua file, jangan edit di komponen:

| File | Isinya |
| --- | --- |
| `src/data/site.ts` | Profil, intro, 4 project utama, "Other things I've made", About, Experience, Tools, Contact |
| `src/data/cases.ts` | Isi halaman case study `/work/<slug>` |

Format inline yang bisa dipakai di teks: `` `kode` ``, `*miring*`, `**tebal**`, `[teks](https://link)`.

## File yang tinggal ditaruh (tanpa ubah kode)

Taruh di folder `public/`, lalu build ulang. Kalau filenya nggak ada, bagiannya otomatis disembunyikan.

| Taruh di | Hasilnya |
| --- | --- |
| `public/cv.pdf` | Link "CV" muncul di header, intro, dan Contact |
| `public/me.jpg` (atau `.png` / `.webp`) | Foto kamu di bagian About, tampil utuh sesuai bentuk fotonya (nggak di-crop) |
| `public/work/playhub/01-lobby.png` | Galeri screenshot di halaman case study PlayHub |

Nama file screenshot jadi caption: `02-game-room.png` tampil sebagai "Game room". Angka di depan cuma buat urutan. Slug yang dipakai: `playhub`, `okachu`, `trisenpai`, `splitit`.

## Deploy ke Vercel

1. Push folder ini ke repo GitHub baru.
2. Di vercel.com, **Add New > Project**, pilih repo-nya. Framework kebaca otomatis sebagai Next.js, setting default nggak perlu diubah.
3. Klik **Deploy**.

URL untuk metadata, sitemap dan gambar preview link (OG image) otomatis ikut domain production Vercel. Kalau nanti pakai domain sendiri, tambahin environment variable `NEXT_PUBLIC_SITE_URL=https://domainkamu.com` di Vercel (Settings > Environment Variables), lalu redeploy.

## Struktur singkat

```
src/
  app/            halaman, layout, OG image, sitemap, robots, 404
  components/     header, footer, kartu project
    figures/      diagram interaktif tiap project
  data/           semua teks
  fonts/          Schibsted Grotesk + Martian Mono (self-host, lisensi OFL ada di folder ini)
  lib/            helper Hilbert curve, deteksi file di public/, base URL
```

## Kenapa ringan

- Nggak ada library animasi, 3D, atau UI kit. Semua animasi CSS (cuma transform dan opacity), ditambah satu IntersectionObserver buat reveal pas scroll.
- Animasi otomatis mati kalau pengunjung nyalain "reduce motion" di HP/laptopnya.
- Font di-host sendiri, cuma 2 file (sekitar 70 KB) yang di-preload. Italic baru diunduh kalau dipakai.
- Tiap diagram di-hydrate terpisah (Suspense), jadi main thread nggak ke-block lama.
- Lighthouse mobile (simulasi HP pelan) waktu dicek: Performance sekitar 90 sampai 93, Accessibility 100, Best Practices 100, SEO 100.

## Animasi

| Di mana | Apa | Atur di |
| --- | --- | --- |
| Buka halaman | Logo menggambar sendiri, judul naik kata per kata, stabilo di bawah frasa | `headlineMark` di `src/data/site.ts` buat ganti frasa yang distabilo |
| Scroll | Section, project, list muncul halus | atribut `data-reveal` di komponen, CSS bagian "Motion" di `globals.css` |
| Diagram PlayHub & OKACHU | Main sendiri sekali pas pertama kelihatan, berhenti kalau udah diklik orang | `src/lib/useFirstView.ts` |
| Klik judul project | Judulnya "terbang" ke halaman case study (View Transitions) | `ViewTransition` di `ProjectEntry.tsx` dan `work/[slug]/page.tsx` |
| Atas halaman | Garis progress baca | `.progress` di `globals.css` |
