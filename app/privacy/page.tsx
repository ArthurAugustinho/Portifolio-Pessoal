import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How this site handles the data you send through the contact form, and which third-party services it uses.',
}

export default function PrivacyPage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Privacy</h1>
      <p className="t-dim">Last updated: 11 November 2026.</p>

      <div className={styles.corpo}>
        <section>
          <h2 className="t-h3">Who runs this site</h2>
          <p>
            This site is run by Arthur Augustinho. It is a personal portfolio with no user
            accounts and no database.
          </p>
        </section>

        <section>
          <h2 className="t-h3">What the contact form collects</h2>
          <p>
            The contact form asks for your name, your email address and a message. When you send
            it, these three fields are emailed to me through Resend, an email delivery service,
            so that I can read and reply to your message. The site itself does not store
            messages anywhere.
          </p>
          <p>
            To check that the form is being used by a person and not by a bot, the page also
            loads Cloudflare Turnstile. Your IP address is sent to Cloudflare for that check.
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
          <h2 className="t-h3">How long I keep your message</h2>
          <p>
            I keep messages in my inbox for 30 days. Resend, the email delivery service, also
            keeps delivery logs for a period set by its own policy.
          </p>
        </section>

        <section>
          <h2 className="t-h3">Asking for your data to be deleted</h2>
          <p>
            To ask for the data you sent through the form to be deleted, write to me at{' '}
            <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a> or
            through the <Link href="/contato">contact form</Link>. I reply within one to two
            days.
          </p>
        </section>
      </div>
    </div>
  )
}
