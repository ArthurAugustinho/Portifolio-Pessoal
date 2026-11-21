// app/fonts.ts
//
// next/font baixa o arquivo no build e o serve do próprio domínio.
// Sem requisição ao Google em runtime, sem layout shift, sem custo.
//
// Uma família só (ADR 0012): Archivo variável com os eixos wght (padrão)
// e wdth. A largura é aplicada por classe com font-variation-settings
// (ver tokens.css); não há segunda fonte.

import { Archivo } from 'next/font/google'

export const sans = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
})
