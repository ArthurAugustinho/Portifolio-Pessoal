import type { Metadata } from 'next'
import { Botao } from '@/components/ui/Botao'
import styles from './not-found.module.css'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <div className={styles.pagina}>
      <p className="t-meta">404</p>
      <h1 className="t-titulo">Page not found</h1>
      <p className="t-lead">This page doesn’t exist or has been moved.</p>
      <Botao href="/" variante="primario">
        Back to home
      </Botao>
    </div>
  )
}
