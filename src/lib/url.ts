// Base URL for metadata, sitemap and OG images.
// Di Vercel otomatis pakai domain production. Kalau punya domain sendiri,
// set NEXT_PUBLIC_SITE_URL di Vercel (Settings > Environment Variables).
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fromVercel || "http://localhost:3000").replace(/\/$/, "");
