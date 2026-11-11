import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Rodape } from '@/components/layout/Rodape'
import { SITE_URL } from '@/lib/site'
import { sans, mono } from './fonts'
import './globals.css'
import './tokens.css'

const DESCRICAO =
  'Portfolio of Arthur Augustinho, full stack developer in Brazil and Europe. Web applications, backend and infrastructure.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s · Arthur Augustinho',
    default: 'Arthur Augustinho',
  },
  description: DESCRICAO,
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
