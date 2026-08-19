import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const PROJETOS_DIR = path.join(process.cwd(), 'content/projetos')

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
  stack: string[]
  destaque: boolean
  papel: string
  periodo: string
  links: ProjetoLink[]
  capa?: string
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
  const caminho = path.join(PROJETOS_DIR, `${slug}.mdx`)

  if (!fs.existsSync(caminho)) {
    return null
  }

  const { data, content } = matter(fs.readFileSync(caminho, 'utf8'))

  return {
    slug: data.slug ?? slug,
    nome: data.nome,
    resumo: data.resumo,
    ano: data.ano,
    stack: data.stack ?? [],
    destaque: data.destaque ?? false,
    papel: data.papel,
    periodo: data.periodo,
    links: data.links ?? [],
    capa: resolverCaminhoPublico(data.capa),
    video: resolverVideo(data.video),
    capturas: resolverCapturas(data.capturas),
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
// ausentes ou apontando para um arquivo que não existe em public/,
// o chamador recorre a um placeholder — nunca uma imagem quebrada.
function resolverCaminhoPublico(caminho: unknown): string | undefined {
  if (typeof caminho !== 'string' || caminho.length === 0) {
    return undefined
  }

  const caminhoAbsoluto = path.join(process.cwd(), 'public', caminho)
  return fs.existsSync(caminhoAbsoluto) ? caminho : undefined
}

function resolverVideo(video: unknown): ProjetoVideo | undefined {
  if (typeof video !== 'object' || video === null) {
    return undefined
  }

  const { src, poster } = video as { src?: unknown; poster?: unknown }
  const srcResolvido = resolverCaminhoPublico(src)
  const posterResolvido = resolverCaminhoPublico(poster)

  if (!srcResolvido || !posterResolvido) {
    return undefined
  }

  return { src: srcResolvido, poster: posterResolvido }
}

function resolverCapturas(capturas: unknown): ProjetoCaptura[] {
  if (!Array.isArray(capturas)) {
    return []
  }

  return capturas
    .map((captura): ProjetoCaptura | null => {
      if (typeof captura !== 'object' || captura === null) {
        return null
      }

      const { src, legenda, moldura } = captura as {
        src?: unknown
        legenda?: unknown
        moldura?: unknown
      }

      const srcResolvido = resolverCaminhoPublico(src)

      if (!srcResolvido) {
        return null
      }

      return {
        src: srcResolvido,
        legenda: typeof legenda === 'string' ? legenda : '',
        moldura: moldura === 'nenhuma' ? 'nenhuma' : 'navegador',
      }
    })
    .filter((captura): captura is ProjetoCaptura => captura !== null)
}
