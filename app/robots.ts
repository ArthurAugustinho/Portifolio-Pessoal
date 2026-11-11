import type { MetadataRoute } from 'next'
import { INDEXAVEL, SITE_URL } from '@/lib/site'

// Exigido pelo export estático (output: 'export').
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  if (!INDEXAVEL) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
