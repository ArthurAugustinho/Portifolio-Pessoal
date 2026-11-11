import type { Metadata } from 'next'
import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Projetos',
  description:
    'Projetos de Arthur Augustinho: aplicações web, backend e infraestrutura, com stack, papel e resultado de cada um.',
}

export default function ProjetosPage() {
  const projetos = ordenarProjetos(getProjetos())

  return (
    <div className={styles.pagina}>
      <h1 className="t-h2">Projetos</h1>

      {projetos.length === 0 ? (
        <p className="t-dim">Nenhum projeto publicado ainda.</p>
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
