// Usada em metadata, robots.ts, sitemap.ts e opengraph-image.tsx —
// um só lugar para não duplicar o fallback de ambiente.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
