import { compile, run } from '@mdx-js/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as runtime from 'react/jsx-runtime'
import { FichaTecnica } from '@/components/projeto/FichaTecnica'
import { Galeria } from '@/components/projeto/Galeria'
import { mdxComponents } from '@/components/projeto/mdxComponents'
import { MidiaPrincipal } from '@/components/projeto/MidiaPrincipal'
import { NavegacaoProjetos } from '@/components/projeto/NavegacaoProjetos'
import { getProjeto, getProjetos, ordenarProjetos } from '@/lib/projetos'
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

  return {
    title: projeto.nome,
    description: projeto.resumo,
    openGraph: {
      title: projeto.nome,
      description: projeto.resumo,
      images: projeto.capa ? [{ url: projeto.capa }] : undefined,
    },
  }
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
        <Link href="/projetos" className="t-label">
          ← Projetos
        </Link>
        <h1 className="t-titulo">{projeto.nome}</h1>
        <p className="t-dim">{projeto.resumo}</p>
      </header>

      <div className={styles.coluna}>
        <FichaTecnica
          papel={projeto.papel}
          periodo={projeto.periodo}
          stack={projeto.stack}
          links={projeto.links}
        />
      </div>

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
