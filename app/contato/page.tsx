import type { Metadata } from 'next'
import { EMAIL, perfil } from '@/content/perfil'
import { metadataDaPagina } from '@/lib/site'
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

      <p className={styles.emailDireto}>
        Write to me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </div>
  )
}
