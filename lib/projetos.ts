import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { INDEXAVEL } from '@/lib/site'
import { tecnologiaPorId } from '@/lib/tecnologias'

const PROJETOS_DIR = path.join(process.cwd(), 'content/projetos')
const FORMATO_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Campos que o card, a prévia e a ordenação leem como dado, não como texto de
// página: não aceitam TODO (o projeto fica fora até o autor fornecer o dado).
const dadoObrigatorio = z
  .string()
  .min(1)
  .refine((valor) => !valor.includes('TODO:'), 'Dado obrigatório: não pode ser TODO.')

// Texto que o autor ainda não escreveu. Com a indexação liberada o build falha
// (getProjeto); antes disso, as páginas omitem o trecho em vez de exibir "TODO:".
export function ehPendente(texto: string): boolean {
  return texto.trimStart().startsWith('TODO:')
}

// O corpo do MDX tem algum texto além dos parágrafos pendentes?
export function corpoTemTexto(conteudo: string): boolean {
  return conteudo
    .split(/\n\s*\n/)
    .some((bloco) => bloco.trim() !== '' && !ehPendente(bloco))
}

// Validado no build: campo ausente ou com tipo errado derruba o build
// com o nome do arquivo, em vez de virar `undefined` silencioso na página.
const frontmatterSchema = z
  .object({
    slug: z.string().regex(FORMATO_SLUG, 'Use só letras minúsculas, números e hífens.'),
    nome: z.string().min(1),
    resumo: z.string().min(1),
    ano: z.number().int(),
    // ids de lib/tecnologias.ts: um erro de digitação derruba o build com o
    // nome do arquivo, em vez de virar um ícone ausente.
    stack: z
      .array(z.string().min(1))
      .min(1)
      .superRefine((ids, ctx) => {
        const desconhecidos = ids.filter((id) => !tecnologiaPorId(id))
        if (desconhecidos.length > 0) {
          ctx.addIssue({
            code: 'custom',
            message: `Tecnologia fora de lib/tecnologias.ts: ${desconhecidos.join(', ')}.`,
          })
        }
      }),
    destaque: z.boolean(),
    papel: dadoObrigatorio,
    periodo: dadoObrigatorio,
    // texto curto da prévia ("The problem"); pode ter TODO enquanto o autor não escreve
    problema: z.string().min(1),
    links: z.array(z.object({ label: z.string().min(1), url: z.url() }).strict()).default([]),
    capa: z.string().min(1).optional(),
    // Descrição do que a capa mostra, para leitor de tela. Obrigatória com capa.
    capaAlt: z.string().min(1).optional(),
    video: z.object({ src: z.string().min(1), poster: z.string().min(1) }).strict().optional(),
    capturas: z
      .array(
        z
          .object({
            src: z.string().min(1),
            // vira o alt da imagem na galeria, por isso é obrigatória
            legenda: z.string().min(1),
            moldura: z.enum(['navegador', 'nenhuma']).default('navegador'),
          })
          .strict(),
      )
      .default([]),
  })
  .strict()

export type ProjetoLink = {
  label: string
  url: string
}

export type ProjetoCaptura = {
  src: string
  legenda: string
  moldura: 'navegador' | 'nenhuma'
}

export type ProjetoVideo = {
  src: string
  poster: string
}

export type Projeto = {
  slug: string
  nome: string
  resumo: string
  ano: number
  // ids de lib/tecnologias.ts
  stack: string[]
  destaque: boolean
  papel: string
  periodo: string
  problema: string
  links: ProjetoLink[]
  capa?: string
  capaAlt?: string
  video?: ProjetoVideo
  capturas: ProjetoCaptura[]
  conteudo: string
}

export function getProjetos(): Projeto[] {
  return fs
    .readdirSync(PROJETOS_DIR)
    .filter((arquivo) => arquivo.endsWith('.mdx'))
    .map((arquivo) => getProjeto(arquivo.replace(/\.mdx$/, '')))
    .filter((projeto): projeto is Projeto => projeto !== null)
}

export function getProjeto(slug: string): Projeto | null {
  // o slug pode vir da URL: nada fora do formato chega ao sistema de arquivos
  if (!FORMATO_SLUG.test(slug)) {
    return null
  }

  const arquivo = `content/projetos/${slug}.mdx`
  const caminho = path.join(PROJETOS_DIR, `${slug}.mdx`)

  if (!fs.existsSync(caminho)) {
    return null
  }

  const { data, content } = matter(fs.readFileSync(caminho, 'utf8'))
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

  if (frontmatter.capa && !frontmatter.capaAlt) {
    throw new Error(
      `${arquivo}: toda capa precisa de capaAlt, com a descrição do que a imagem mostra (nunca "imagem do projeto").`,
    )
  }

  // Com a indexação liberada, texto de preenchimento não pode ir ao ar:
  // o build falha em vez de publicar um TODO.
  if (INDEXAVEL && (content.includes('TODO:') || JSON.stringify(data).includes('TODO:'))) {
    throw new Error(
      `${arquivo} ainda contém "TODO:". Resolva antes de publicar com NEXT_PUBLIC_INDEXAVEL=true.`,
    )
  }

  return {
    slug: frontmatter.slug,
    nome: frontmatter.nome,
    resumo: frontmatter.resumo,
    ano: frontmatter.ano,
    stack: frontmatter.stack,
    destaque: frontmatter.destaque,
    papel: frontmatter.papel,
    periodo: frontmatter.periodo,
    problema: frontmatter.problema,
    links: frontmatter.links,
    capa: resolverCaminhoPublico(frontmatter.capa),
    capaAlt: frontmatter.capaAlt,
    video: resolverVideo(frontmatter.video),
    capturas: resolverCapturas(frontmatter.capturas),
    conteudo: content,
  }
}

// destaque primeiro, depois ano decrescente — usada na listagem,
// na navegação anterior/próximo e em qualquer lugar que precise
// da mesma ordem.
export function ordenarProjetos(projetos: Projeto[]): Projeto[] {
  return [...projetos].sort((a, b) => {
    if (a.destaque !== b.destaque) {
      return a.destaque ? -1 : 1
    }
    return b.ano - a.ano
  })
}

// Caminhos de mídia (capa, vídeo, capturas) são opcionais e, quando
// apontam para um arquivo que não existe em public/, o chamador recorre
// a um placeholder — nunca uma imagem quebrada. O caminho sai sempre com
// "/" inicial, que o next/image exige para imagem local.
function resolverCaminhoPublico(caminho: string | undefined): string | undefined {
  if (!caminho) {
    return undefined
  }

  const normalizado = `/${caminho.replace(/^\/+/, '')}`
  return fs.existsSync(path.join(process.cwd(), 'public', normalizado)) ? normalizado : undefined
}

function resolverVideo(video: ProjetoVideo | undefined): ProjetoVideo | undefined {
  const src = resolverCaminhoPublico(video?.src)
  const poster = resolverCaminhoPublico(video?.poster)
  return src && poster ? { src, poster } : undefined
}

function resolverCapturas(capturas: ProjetoCaptura[]): ProjetoCaptura[] {
  return capturas.flatMap((captura) => {
    const src = resolverCaminhoPublico(captura.src)
    return src ? [{ ...captura, src }] : []
  })
}
