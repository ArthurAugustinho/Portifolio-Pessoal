import type { Metadata } from 'next'

// Usada em metadata, robots.ts, sitemap.ts e opengraph-image.tsx —
// um só lugar para não duplicar o fallback de ambiente.
//
// "||" e não "??": uma env var cadastrada mas deixada em branco chega
// aqui como string vazia, não como undefined — e "new URL('')" quebra
// o build (foi exatamente o que aconteceu no primeiro deploy).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Enquanto o conteúdo dos projetos tiver TODO, o site fica fora do índice
// de busca (robots.ts). Com "true", o build também passa a falhar se
// algum MDX ainda contiver "TODO:" (lib/projetos.ts).
export const INDEXAVEL = process.env.NEXT_PUBLIC_INDEXAVEL === 'true'

// Metadata completa de uma página. O Next substitui o objeto openGraph
// inteiro quando a página define o seu (não faz merge com o do layout);
// por isso a página precisa repetir título, descrição, URL e imagem. Sem
// isto, o compartilhamento de /sobre mostra o título e a URL da home.
// Os caminhos (canonical, url, imagem) são resolvidos contra metadataBase.
export function metadataDaPagina({
  titulo,
  descricao,
  caminho,
  imagem = '/opengraph-image',
}: {
  titulo: string
  descricao: string
  caminho: string
  imagem?: string
}): Metadata {
  const tituloCompleto = `${titulo} · Arthur Augustinho`

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      title: tituloCompleto,
      description: descricao,
      url: caminho,
      siteName: 'Arthur Augustinho',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: imagem }],
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloCompleto,
      description: descricao,
      images: [imagem],
    },
  }
}

// O formulário de contato só aparece com a chave pública do Turnstile no
// build (ADR 0007). Sem ela o widget não carrega e o envio nunca passaria
// na verificação; nesse caso a página oferece só o e-mail.
export const FORMULARIO_ATIVO = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
