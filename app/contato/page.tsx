import type { Metadata } from 'next'
import { FormularioContato } from './FormularioContato'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'TODO: descrição da página de contato',
}

export default function ContatoPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-h2">Contato</h1>
      <p className="t-dim">TODO: frase de contato</p>

      <p className={styles.emailDireto}>
        Prefere email direto? <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>
      </p>

      <FormularioContato />
    </div>
  )
}
