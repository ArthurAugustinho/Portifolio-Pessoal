import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.pagina}>
      <p className="t-label">404</p>
      <h1 className="t-h2">Página não encontrada</h1>
      <p className="t-dim">Essa página não existe ou foi movida.</p>
      <Link href="/">Voltar para a home</Link>
    </div>
  )
}
