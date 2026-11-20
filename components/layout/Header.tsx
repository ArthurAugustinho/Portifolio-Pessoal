'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ControlePausa } from './ControlePausa'
import styles from './Header.module.css'

// Provisório (Etapa 1): enquanto a home não tem as seções About, Stack e
// Experience, o menu leva às páginas que já existem. A Etapa 2 troca por
// âncoras (#about, #stack, #experience, #projects, #contact; nas páginas
// internas, /#about) e acrescenta Blog quando houver posts (ADR 0017).
const MENU = [
  { href: '/sobre', texto: 'About' },
  { href: '/projetos', texto: 'Projects' },
  { href: '/contato', texto: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const naHome = pathname === '/'
  const [caminho, setCaminho] = useState('')
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)

  // Caminho da seção visível (/projects, /contact...), só na home e só texto:
  // não altera a URL. A seção ativa é a que cruzou 45% da altura da janela.
  // O estado só muda dentro do callback do observer, e o servidor nunca
  // renderiza o caminho, então não há divergência de hidratação.
  useEffect(() => {
    if (!naHome) return

    const secoes = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]'))
    const visiveis = new Set<HTMLElement>()

    const atualizar = () => {
      // De cima para baixo: vale a última seção que já passou da linha.
      const atual = secoes.filter((secao) => visiveis.has(secao)).at(-1)
      const nome = atual?.dataset.secao ?? ''
      setCaminho(nome ? `/${nome.toLowerCase()}` : '')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const secao = entry.target as HTMLElement
          if (entry.isIntersecting) visiveis.add(secao)
          else visiveis.delete(secao)
        }
        atualizar()
      },
      // Faixa entre o header e 45% da janela: a seção cujo topo passou dela.
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 },
    )

    for (const secao of secoes) observer.observe(secao)
    return () => observer.disconnect()
  }, [naHome])

  const fechar = () => setAberto(false)

  return (
    <>
      <a href="#main" className={styles.pular}>
        Skip to content
      </a>

      <header
        className={styles.header}
        onKeyDown={(evento) => {
          if (evento.key === 'Escape' && aberto) {
            fechar()
            botaoMenu.current?.focus()
          }
        }}
      >
        <div className={styles.barra}>
          <Link href="/" className={styles.marca} onClick={fechar}>
            <span className={styles.quadrado} aria-hidden="true" />
            <span className={styles.nomeCompleto}>Arthur Augustinho</span>
            <span className={styles.nomeCurto}>A. Augustinho</span>
          </Link>

          <span className={`t-meta ${styles.caminho}`} aria-hidden="true">
            {naHome ? caminho : ''}
          </span>

          <div className={styles.direita}>
            <button
              ref={botaoMenu}
              type="button"
              className={styles.botaoMenu}
              aria-expanded={aberto}
              aria-controls="menu-principal"
              onClick={() => setAberto(!aberto)}
            >
              {aberto ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Menu
            </button>

            <nav
              id="menu-principal"
              aria-label="Main"
              className={`${styles.nav} ${aberto ? styles.navAberto : ''}`}
            >
              <ul className={styles.lista}>
                {MENU.map((item) => {
                  const atual = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`t-pequeno ${styles.link}`}
                        aria-current={atual ? 'page' : undefined}
                        onClick={fechar}
                      >
                        {item.texto}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <ControlePausa />
          </div>
        </div>
      </header>
    </>
  )
}
