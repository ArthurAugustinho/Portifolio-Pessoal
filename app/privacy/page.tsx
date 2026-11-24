import type { Metadata } from 'next'
import { EMAIL } from '@/content/perfil'
import { metadataDaPagina } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Privacy',
  descricao:
    'What this site collects, which third-party services it uses, and how to ask for an email you sent to be deleted.',
  caminho: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Privacy</h1>
      <p className="t-dim">Last updated: 24 November 2026.</p>

      <div className={styles.corpo}>
        <section>
          <h2 className="t-h3">Who runs this site</h2>
          <p>
            This site is run by Arthur Augustinho. It is a personal portfolio with no user
            accounts, no database and no forms.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Cookies and analytics</h2>
          <p>
            This site does not set cookies. It uses Cloudflare Web Analytics to count visits,
            which according to Cloudflare collects aggregated data without cookies or other
            client-side storage.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Your animation preference</h2>
          <p>
            The site has a button in the header that pauses its animations. If you use it, the
            choice is saved in your browser (in local storage, under the name “movimento”) so it
            is remembered on your next visit. It is not a cookie, it is never sent to a server
            and it stays on your device. If your system asks for reduced motion, the animations
            start paused.
          </p>
        </section>

        <section>
          <h2 className="t-h3">If you email me</h2>
          <p>
            The site does not collect anything when you write to me: the email address on the
            contact page is a plain link that opens your own mail program. Your message goes
            from your email provider to mine and stays in my inbox. I keep messages there for 30
            days.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Asking for your email to be deleted</h2>
          <p>
            To ask for an email you sent me to be deleted, write to me at{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. I reply within one to two days.
          </p>
        </section>
      </div>
    </div>
  )
}
