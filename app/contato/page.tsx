import type { Metadata } from 'next'
import { FormularioContato } from './FormularioContato'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Arthur Augustinho for freelance work or remote positions.',
}

export default function ContatoPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Contact</h1>
      <p className="t-dim">Open to freelance work and remote positions.</p>

      <p className={styles.emailDireto}>
        Prefer to email directly? <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>
      </p>

      <FormularioContato />
    </div>
  )
}
