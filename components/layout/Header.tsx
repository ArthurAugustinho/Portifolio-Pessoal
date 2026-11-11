'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

const LINKS = [
  { href: '/projetos', texto: 'Projects' },
  { href: '/sobre', texto: 'About' },
  { href: '/contato', texto: 'Contact' },
]

type SecaoAtual = { numero: string; nome: string }

export function Header() {
  const pathname = usePathname()
  const naHome = pathname === '/'
  const [secao, setSecao] = useState<SecaoAtual | null>(null)

  // Contador "SEC 01 · INTRO": só na home, lendo as seções marcadas com
  // data-secao. O estado só muda dentro do callback do observer (fora da
  // renderização), e o servidor nunca renderiza o contador, então não há
  // divergência de hidratação.
  useEffect(() => {
    if (!naHome) return

    const elementos = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]'))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const indice = elementos.indexOf(entry.target as HTMLElement)
          if (indice === -1) continue
          setSecao({
            numero: String(indice + 1).padStart(2, '0'),
            nome: (entry.target as HTMLElement).dataset.secao ?? '',
          })
        }
      },
      // 48px = altura do header sticky.
      { rootMargin: '-48px 0px -70% 0px', threshold: 0 },
    )

    for (const elemento of elementos) {
      observer.observe(elemento)
    }

    return () => observer.disconnect()
  }, [naHome])

  return (
    <>
      <a href="#main" className={styles.pular}>
        Skip to content
      </a>

      <header className={styles.header}>
        <Link href="/" className={`t-label ${styles.nome}`} aria-label="Arthur Augustinho, home">
          <span className={styles.nomeCompleto}>Arthur Augustinho</span>
          <span className={styles.nomeCurto}>A. Augustinho</span>
        </Link>

        {/* Sempre presente a partir de 900px (mesmo vazio) para o nav
            não migrar para a coluna do meio fora da home. */}
        <span className={`t-label ${styles.contador}`} aria-live="polite">
          {naHome && secao ? `SEC ${secao.numero} · ${secao.nome}` : null}
        </span>

        <nav aria-label="Main" className={styles.nav}>
          {LINKS.map((link) => {
            const atual = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`t-label ${styles.link}`}
                aria-current={atual ? 'page' : undefined}
              >
                {link.texto}
              </Link>
            )
          })}
        </nav>
      </header>
    </>
  )
}
