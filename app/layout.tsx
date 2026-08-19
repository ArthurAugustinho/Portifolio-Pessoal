import type { Metadata } from 'next'
import { Rodape } from '@/components/layout/Rodape'
import { SITE_URL } from '@/lib/site'
import { sans, mono } from './fonts'
import './globals.css'
import './tokens.css'

const DESCRICAO = 'TODO: descrição do portfólio'

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
    locale: 'pt_BR',
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
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
