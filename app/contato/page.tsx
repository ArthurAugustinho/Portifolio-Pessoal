import type { Metadata } from 'next'
import { perfil } from '@/content/perfil'
import { FormularioContato } from './FormularioContato'
import { FORMULARIO_ATIVO, metadataDaPagina } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Contact',
  descricao:
    'Get in touch with Arthur Augustinho about full-time roles in Europe.',
  caminho: '/contato',
})

export default function ContatoPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Contact</h1>
      <p className="t-dim">{perfil.status}.</p>

      {FORMULARIO_ATIVO ? (
        <>
          <p className={styles.emailDireto}>
            Prefer to email directly? <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>
          </p>

          <FormularioContato />
        </>
      ) : (
        <p className={styles.emailDireto}>
          Write to me at <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>.
        </p>
      )}
    </div>
  )
}
