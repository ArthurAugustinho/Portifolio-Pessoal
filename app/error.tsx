'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import styles from './error.module.css'

type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // console apenas — nunca mostramos detalhe de exceção na página.
    console.error(error)
  }, [error])

  return (
    <div className={styles.pagina}>
      <p className="t-label">Erro</p>
      <h1 className="t-h2">Algo deu errado</h1>
      <p className="t-dim">Tente de novo ou volte para a home.</p>
      <div className={styles.acoes}>
        <button type="button" onClick={reset} className={styles.botao}>
          Tentar de novo
        </button>
        <Link href="/">Voltar para a home</Link>
      </div>
    </div>
  )
}
