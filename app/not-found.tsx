import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.pagina}>
      <p className="t-label">404</p>
      <h1 className="t-h2">Page not found</h1>
      <p className="t-dim">This page doesn’t exist or has been moved.</p>
      <Link href="/">Back to home</Link>
    </div>
  )
}
