import type { Metadata } from 'next'
import { FormularioContato } from './FormularioContato'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com Arthur Augustinho para freelance ou posições remotas.',
}

export default function ContatoPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Contato</h1>
      <p className="t-dim">Aberto a freelance e posições remotas.</p>

      <p className={styles.emailDireto}>
        Prefere email direto? <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>
      </p>

      <FormularioContato />
    </div>
  )
}
