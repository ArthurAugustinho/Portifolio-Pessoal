import { compile, run } from '@mdx-js/mdx'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as runtime from 'react/jsx-runtime'
import { FichaTecnica } from '@/components/projeto/FichaTecnica'
import { Galeria } from '@/components/projeto/Galeria'
import { mdxComponents } from '@/components/projeto/mdxComponents'
import { MidiaPrincipal } from '@/components/projeto/MidiaPrincipal'
import { NavegacaoProjetos } from '@/components/projeto/NavegacaoProjetos'
import { getProjeto, getProjetos, ordenarProjetos } from '@/lib/projetos'
import { metadataDaPagina } from '@/lib/site'
import styles from './page.module.css'

export function generateStaticParams() {
  return getProjetos().map((projeto) => ({ slug: projeto.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/projetos/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const projeto = getProjeto(slug)

  if (!projeto) {
    return {}
  }

  // Sem capa, cai na imagem Open Graph padrão do site.
  return metadataDaPagina({
    titulo: projeto.nome,
    descricao: projeto.resumo,
    caminho: `/projetos/${slug}`,
    imagem: projeto.capa,
  })
}

export default async function ProjetoPage({ params }: PageProps<'/projetos/[slug]'>) {
  const { slug } = await params
  const projeto = getProjeto(slug)

  if (!projeto) {
    notFound()
  }

  const projetos = ordenarProjetos(getProjetos())
  const indice = projetos.findIndex((item) => item.slug === projeto.slug)
  const anterior = indice > 0 ? projetos[indice - 1] : undefined
  const proximo = indice < projetos.length - 1 ? projetos[indice + 1] : undefined

  const codigoMdx = String(await compile(projeto.conteudo, { outputFormat: 'function-body' }))
  const { default: Corpo } = await run(codigoMdx, runtime)

  return (
    <article className={styles.pagina}>
      <header className={`${styles.coluna} ${styles.cabecalho}`}>
        <Link href="/projetos" className={`t-meta ${styles.voltar}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Projects
        </Link>
        <h1 className="t-titulo">{projeto.nome}</h1>
        <p className="t-lead">{projeto.resumo}</p>
      </header>

      <div className={styles.coluna}>
        <FichaTecnica
          papel={projeto.papel}
          periodo={projeto.periodo}
          stack={projeto.stack}
          links={projeto.links}
        />
      </div>

      <aside className={`${styles.coluna} ${styles.problema}`} aria-labelledby="problema-titulo">
        <h2 id="problema-titulo" className="t-meta">
          The problem
        </h2>
        <p>{projeto.problema}</p>
      </aside>

      <div className={styles.larga}>
        <MidiaPrincipal projeto={projeto} />
      </div>

      <div className={styles.coluna}>
        <Corpo components={mdxComponents} />
      </div>

      {projeto.capturas.length > 0 && (
        <div className={styles.larga}>
          <Galeria capturas={projeto.capturas} />
        </div>
      )}

      <div className={styles.coluna}>
        <NavegacaoProjetos anterior={anterior} proximo={proximo} />
      </div>
    </article>
  )
}
