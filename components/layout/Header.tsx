'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ControlePausa } from './ControlePausa'
import styles from './Header.module.css'

// Itens do menu: ids das seções da home (home.md §2). Na home são âncoras
// (#about); nas páginas internas, /#about. Blog entra quando houver posts
// (ADR 0017, Etapa 3).
const MENU = [
  { id: 'about', texto: 'About' },
  { id: 'stack', texto: 'Stack' },
  { id: 'experience', texto: 'Experience' },
  { id: 'projects', texto: 'Projects' },
  { id: 'contact', texto: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const naHome = pathname === '/'
  // Id da seção visível na home ('' no topo).
  const [secaoAtiva, setSecaoAtiva] = useState('')
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)

  // Seção visível na home: alimenta o caminho em texto (/projects, /contact...),
  // que não altera a URL, e o item ativo do menu. A seção ativa é a que cruzou
  // 45% da altura da janela.
  // O estado só muda dentro do callback do observer, e o servidor nunca
  // renderiza o caminho, então não há divergência de hidratação.
  useEffect(() => {
    if (!naHome) return

    const secoes = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]'))
    const visiveis = new Set<HTMLElement>()

    const atualizar = () => {
      // De cima para baixo: vale a última seção que já passou da linha.
      const atual = secoes.filter((secao) => visiveis.has(secao)).at(-1)
      setSecaoAtiva(atual?.dataset.secao ?? '')
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
            {naHome && secaoAtiva ? `/${secaoAtiva}` : ''}
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
                  const atual = naHome && secaoAtiva === item.id
                  return (
                    <li key={item.id}>
                      <Link
                        href={naHome ? `#${item.id}` : `/#${item.id}`}
                        className={`t-pequeno ${styles.link}`}
                        aria-current={atual ? 'location' : undefined}
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
