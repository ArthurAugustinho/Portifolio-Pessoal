import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './Botao.module.css'

type Props = {
  href: string
  variante?: 'primario' | 'secundario'
  // Link para fora do site: abre em outra aba, sem referrer.
  externo?: boolean
  // Fator do ímã (MASTER: 0,3 nos botões do hero). Sem ele o botão não se move.
  ima?: number
  children: ReactNode
}

// Botão primário (um por tela) e secundário do MASTER. É um link, não um
// <button>: todos os usos levam a algum lugar. Âncora (#projects) e link
// externo usam <a>; rota interna usa Link.
export function Botao({ href, variante = 'secundario', externo, ima, children }: Props) {
  const className = `${styles.botao} ${styles[variante]}`
  const atributosIma = ima ? { 'data-ima': ima } : {}

  if (externo) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...atributosIma}>
        {children}
      </a>
    )
  }

  if (href.startsWith('/') && !href.startsWith('/#')) {
    return (
      <Link href={href} className={className} {...atributosIma}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} {...atributosIma}>
      {children}
    </a>
  )
}
