// Usada em metadata, robots.ts, sitemap.ts e opengraph-image.tsx —
// um só lugar para não duplicar o fallback de ambiente.
//
// "||" e não "??": uma env var cadastrada mas deixada em branco chega
// aqui como string vazia, não como undefined — e "new URL('')" quebra
// o build (foi exatamente o que aconteceu no primeiro deploy).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
