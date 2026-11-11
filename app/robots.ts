import type { MetadataRoute } from 'next'
import { INDEXAVEL, SITE_URL } from '@/lib/site'

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
