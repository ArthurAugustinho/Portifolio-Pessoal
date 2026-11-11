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
      <p className="t-label">Error</p>
      <h1 className="t-h2">Something went wrong</h1>
      <p className="t-dim">Try again or go back to the home page.</p>
      <div className={styles.acoes}>
        <button type="button" onClick={reset} className={styles.botao}>
          Try again
        </button>
        <Link href="/">Back to home</Link>
      </div>
    </div>
  )
}
