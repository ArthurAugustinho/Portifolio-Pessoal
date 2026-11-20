import type { Metadata } from 'next'
import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import { metadataDaPagina } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Projects',
  descricao:
    'Projects by Arthur Augustinho: web applications, backend and infrastructure, with the stack, role and outcome of each.',
  caminho: '/projetos',
})

export default function ProjetosPage() {
  const projetos = ordenarProjetos(getProjetos())

  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Projects</h1>

      {projetos.length === 0 ? (
        <p className="t-dim">No projects published yet.</p>
      ) : (
        <div className={styles.grid}>
          {projetos.map((projeto) => (
            <ProjetoCard key={projeto.slug} projeto={projeto} nivelTitulo="h2" />
          ))}
        </div>
      )}
    </div>
  )
}
