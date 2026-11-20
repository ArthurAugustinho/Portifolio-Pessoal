import type { MetadataRoute } from 'next'
import { temPosts } from '@/lib/posts'
import { getProjetos } from '@/lib/projetos'
import { SITE_URL } from '@/lib/site'

// Exigido pelo export estático (output: 'export').
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // /blog só existe quando há posts (ADR 0017).
  const rotas = ['', '/sobre', '/projetos', '/contato', '/privacy', ...(temPosts() ? ['/blog'] : [])]
  const rotasEstaticas = rotas.map((rota) => ({
    url: `${SITE_URL}${rota}`,
  }))

  const rotasProjetos = getProjetos().map((projeto) => ({
    url: `${SITE_URL}/projetos/${projeto.slug}`,
  }))

  return [...rotasEstaticas, ...rotasProjetos]
}
