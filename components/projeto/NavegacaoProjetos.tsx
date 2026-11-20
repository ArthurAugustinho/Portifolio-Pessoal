import { ArrowLeft, ArrowRight } from 'lucide-react'
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
    <nav className={styles.nav} aria-label="Project navigation">
      {anterior && (
        <Link href={`/projetos/${anterior.slug}`} className={styles.link}>
          <span className={`t-meta ${styles.rotulo}`}>
            <ArrowLeft size={14} aria-hidden="true" />
            Previous
          </span>
          <span className={`t-h3 ${styles.nome}`}>{anterior.nome}</span>
        </Link>
      )}

      {proximo && (
        <Link href={`/projetos/${proximo.slug}`} className={`${styles.link} ${styles.proximo}`}>
          <span className={`t-meta ${styles.rotulo}`}>
            Next
            <ArrowRight size={14} aria-hidden="true" />
          </span>
          <span className={`t-h3 ${styles.nome}`}>{proximo.nome}</span>
        </Link>
      )}
    </nav>
  )
}
