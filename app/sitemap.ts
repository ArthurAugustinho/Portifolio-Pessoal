import type { MetadataRoute } from 'next'
import { getProjetos } from '@/lib/projetos'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const rotasEstaticas = ['', '/sobre', '/projetos', '/contato'].map((rota) => ({
    url: `${SITE_URL}${rota}`,
  }))

  const rotasProjetos = getProjetos().map((projeto) => ({
    url: `${SITE_URL}/projetos/${projeto.slug}`,
  }))

  return [...rotasEstaticas, ...rotasProjetos]
}
