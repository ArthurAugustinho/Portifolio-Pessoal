// app/fonts.ts
//
// next/font baixa os arquivos no build e os serve do seu próprio domínio.
// Sem requisição ao Google em runtime, sem layout shift, sem custo.

import { Inter, IBM_Plex_Mono } from 'next/font/google'

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  // Só os dois pesos usados no site. Cada peso extra é payload.
  weight: ['400', '700'],
})

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400'],
})

// ---------------------------------------------------------------
// app/layout.tsx
// ---------------------------------------------------------------
//
// import { sans, mono } from './fonts'
// import './tokens.css'
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
//       <body>{children}</body>
//     </html>
//   )
// }
//
// O lang="pt-BR" não é detalhe: define hifenização, corretor
// ortográfico e o idioma anunciado por leitor de tela.
