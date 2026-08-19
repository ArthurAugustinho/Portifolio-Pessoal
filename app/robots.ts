import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Enquanto o conteúdo dos projetos estiver em TODO, o site fica fora
// do índice de busca. Troque NEXT_PUBLIC_INDEXAVEL para "true" quando
// o conteúdo estiver escrito de verdade.
const indexavel = process.env.NEXT_PUBLIC_INDEXAVEL === 'true'

export default function robots(): MetadataRoute.Robots {
  if (!indexavel) {
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
