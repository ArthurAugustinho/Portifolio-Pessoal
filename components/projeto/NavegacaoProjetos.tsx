import Link from 'next/link'
import type { Projeto } from '@/lib/projetos'
import styles from './NavegacaoProjetos.module.css'

type NavegacaoProjetosProps = {
  anterior?: Projeto
  proximo?: Projeto
}

export function NavegacaoProjetos({ anterior, proximo }: NavegacaoProjetosProps) {
  if (!anterior && !proximo) {
    return null
  }

  return (
    <nav className={styles.nav} aria-label="Navegação entre projetos">
      {anterior && (
        <Link href={`/projetos/${anterior.slug}`} className={styles.link}>
          <span className="t-label">← Anterior</span>
          <span>{anterior.nome}</span>
        </Link>
      )}

      {proximo && (
        <Link href={`/projetos/${proximo.slug}`} className={`${styles.link} ${styles.proximo}`}>
          <span className="t-label">Próximo →</span>
          <span>{proximo.nome}</span>
        </Link>
      )}
    </nav>
  )
}
