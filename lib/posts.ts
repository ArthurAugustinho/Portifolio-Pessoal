import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { INDEXAVEL } from '@/lib/site'

// Posts do LinkedIn em MDX (ADR 0017). Cada arquivo é um post: o corpo é o
// texto completo, e o link leva ao original. Sem posts, a seção da home, o
// item do menu e a página /blog não são gerados.
const POSTS_DIR = path.join(process.cwd(), 'content/posts')
const FORMATO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PALAVRAS_POR_MINUTO = 200

function ehLinkedIn(valor: string): boolean {
  const { protocol, hostname } = new URL(valor)
  return protocol === 'https:' && (hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com'))
}

const frontmatterSchema = z
  .object({
    slug: z.string().regex(FORMATO_SLUG, 'Use só letras minúsculas, números e hífens.'),
    titulo: z.string().min(1),
    data: z.iso.date(),
    resumo: z.string().min(1),
    linkedin: z.url().refine(ehLinkedIn, 'O link precisa ser https e de linkedin.com.'),
    idioma: z.enum(['en', 'pt-BR']),
    imagem: z
      .object({
        // Arquivo em public/blog/: a CSP só permite img-src 'self', então
        // nada de hotlink para media.licdn.com.
        src: z
          .string()
          .min(1)
          .refine((src) => !/^[a-z]+:\/\//i.test(src), 'Baixe a imagem para public/blog/.'),
        alt: z.string().min(1),
      })
      .strict()
      .optional(),
  })
  .strict()

export type Post = {
  slug: string
  titulo: string
  data: string
  resumo: string
  linkedin: string
  idioma: 'en' | 'pt-BR'
  imagem?: { src: string; alt: string }
  minutosDeLeitura: number
  conteudo: string
}

export function getPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((arquivo) => arquivo.endsWith('.mdx'))
    .map((arquivo) => lerPost(arquivo.replace(/\.mdx$/, '')))
    .sort((a, b) => b.data.localeCompare(a.data))
}

export function temPosts(): boolean {
  return getPosts().length > 0
}

function lerPost(slug: string): Post {
  const arquivo = `content/posts/${slug}.mdx`
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), 'utf8'))
  const resultado = frontmatterSchema.safeParse(data)

  if (!resultado.success) {
    throw new Error(`Frontmatter inválido em ${arquivo}:\n${z.prettifyError(resultado.error)}`)
  }

  const frontmatter = resultado.data

  if (frontmatter.slug !== slug) {
    throw new Error(
      `${arquivo}: o slug do frontmatter ("${frontmatter.slug}") precisa ser igual ao nome do arquivo.`,
    )
  }

  // Mesma regra dos projetos: com a indexação liberada, TODO não vai ao ar.
  if (INDEXAVEL && (content.includes('TODO:') || JSON.stringify(data).includes('TODO:'))) {
    throw new Error(
      `${arquivo} ainda contém "TODO:". Resolva antes de publicar com NEXT_PUBLIC_INDEXAVEL=true.`,
    )
  }

  const palavras = content.split(/\s+/).filter(Boolean).length

  return {
    slug: frontmatter.slug,
    titulo: frontmatter.titulo,
    data: frontmatter.data,
    resumo: frontmatter.resumo,
    linkedin: frontmatter.linkedin,
    idioma: frontmatter.idioma,
    imagem: resolverImagem(frontmatter.imagem),
    minutosDeLeitura: Math.max(1, Math.ceil(palavras / PALAVRAS_POR_MINUTO)),
    conteudo: content,
  }
}

// Imagem ausente em public/ some do card, nunca vira imagem quebrada.
function resolverImagem(imagem: { src: string; alt: string } | undefined) {
  if (!imagem) {
    return undefined
  }
  const normalizado = `/${imagem.src.replace(/^\/+/, '')}`
  return fs.existsSync(path.join(process.cwd(), 'public', normalizado))
    ? { src: normalizado, alt: imagem.alt }
    : undefined
}
