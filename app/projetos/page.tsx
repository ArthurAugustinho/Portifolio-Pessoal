import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import styles from './page.module.css'

export default function ProjetosPage() {
  const projetos = ordenarProjetos(getProjetos())

  return (
    <>
      <h1 className="t-h2">Projetos</h1>

      {projetos.length === 0 ? (
        <p className="t-dim">Nenhum projeto publicado ainda.</p>
      ) : (
        <div className={styles.grid}>
          {projetos.map((projeto) => (
            <ProjetoCard key={projeto.slug} projeto={projeto} />
          ))}
        </div>
      )}
    </>
  )
}
