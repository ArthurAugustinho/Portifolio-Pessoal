import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/layout/Header'
import { Particulas } from '@/components/layout/Particulas'
import { Rodape } from '@/components/layout/Rodape'
import { SCRIPT_MOVIMENTO } from '@/lib/movimento'
import { temPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'
import { sans } from './fonts'
import './globals.css'
import './tokens.css'

const DESCRICAO =
  'Portfolio of Arthur Augustinho, full-stack developer based in Europe. Web applications, backend and infrastructure.'

// O atributo content do <meta theme-color> não lê variáveis CSS: o valor
// espelha --bg de tokens.css (mesma exceção do opengraph-image.tsx).
export const viewport: Viewport = {
  themeColor: '#0e1621',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s · Arthur Augustinho',
    default: 'Arthur Augustinho · Full-stack developer in Europe',
  },
  description: DESCRICAO,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Arthur Augustinho · Full-stack developer in Europe',
    description: DESCRICAO,
    url: SITE_URL,
    siteName: 'Arthur Augustinho',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arthur Augustinho · Full-stack developer in Europe',
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
        <Particulas />
        <Header temBlog={temPosts()} />
        <main id="main">{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
