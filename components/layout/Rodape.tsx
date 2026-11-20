import Link from 'next/link'
import styles from './Rodape.module.css'

export function Rodape() {
  // Server Component: o ano é o do build, não fixo no código.
  const ano = new Date().getFullYear()

  return (
    <footer className={styles.rodape}>
      <div className={styles.conteudo}>
        <p className="t-meta">© {ano} Arthur Augustinho</p>
        <Link href="/privacy" className={`t-meta ${styles.link}`}>
          Privacy
        </Link>
      </div>
    </footer>
  )
}
