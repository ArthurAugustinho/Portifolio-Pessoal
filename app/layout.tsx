import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Header } from '@/components/layout/Header'
import { Rodape } from '@/components/layout/Rodape'
import { SCRIPT_MOVIMENTO } from '@/lib/movimento'
import { SITE_URL } from '@/lib/site'
import { sans } from './fonts'
import './globals.css'
import './tokens.css'

// Cloudflare Web Analytics (ADR 0009): só em produção e só com o token.
const TOKEN_ANALYTICS = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
const CARREGAR_ANALYTICS = process.env.NODE_ENV === 'production' && Boolean(TOKEN_ANALYTICS)

const DESCRICAO =
  'Portfolio of Arthur Augustinho, full stack developer in Brazil and Europe. Web applications, backend and infrastructure.'

// O atributo content do <meta theme-color> não lê variáveis CSS: o valor
// espelha --bg de tokens.css (mesma exceção do opengraph-image.tsx).
export const viewport: Viewport = {
  themeColor: '#0e1621',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s · Arthur Augustinho',
    default: 'Arthur Augustinho',
  },
  description: DESCRICAO,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Arthur Augustinho',
    description: DESCRICAO,
    url: SITE_URL,
    siteName: 'Arthur Augustinho',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arthur Augustinho',
    description: DESCRICAO,
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        {/* Aplica a preferência de pausa antes da primeira pintura e da
            hidratação (lib/movimento.ts). A CSP 0008 já permite inline. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMENTO }} />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Rodape />
        {CARREGAR_ANALYTICS && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: TOKEN_ANALYTICS })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
