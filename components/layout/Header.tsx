'use client'

import { CodeXml, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ControlePausa } from './ControlePausa'
import styles from './Header.module.css'

// Itens do menu: ids das seções da home (home.md §2). Na home são âncoras
// (#about); nas páginas internas, /#about. Blog só aparece quando há posts
// (ADR 0017).
const MENU = [
  { id: 'about', texto: 'About' },
  { id: 'stack', texto: 'Stack' },
  { id: 'experience', texto: 'Experience' },
  { id: 'projects', texto: 'Projects' },
  { id: 'blog', texto: 'Blog' },
  { id: 'contact', texto: 'Contact' },
]

export function Header({ temBlog }: { temBlog: boolean }) {
  const pathname = usePathname()
  const naHome = pathname === '/'
  // Id da seção visível na home ('' no topo).
  const [secaoAtiva, setSecaoAtiva] = useState('')
  const [aberto, setAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const cabecalho = useRef<HTMLElement>(null)
  const lista = useRef<HTMLUListElement>(null)
  const indicador = useRef<HTMLSpanElement>(null)
  const haviaAtivo = useRef(false)

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

  // Sublinhado âmbar que desliza entre os itens (desktop). É um elemento só,
  // posicionado por variáveis CSS (--x, --w) e movido pela transição do CSS: o
  // GSAP não entra, e a pausa o deixa sem transição (Header.module.css). A
  // primeira aparição não desliza do canto: salta direto.
  useLayoutEffect(() => {
    const itens = lista.current
    const marca = indicador.current
    if (!itens || !marca) return

    const posicionar = () => {
      const ativo = itens.querySelector<HTMLElement>('a[aria-current]')
      if (!ativo) {
        marca.dataset.visivel = 'false'
        haviaAtivo.current = false
        return
      }
      if (!haviaAtivo.current) {
        marca.dataset.salto = ''
        // Força o navegador a aplicar o salto antes de religar a transição.
        void marca.offsetWidth
      }
      marca.style.setProperty('--x', `${ativo.offsetLeft}px`)
      marca.style.setProperty('--w', String(ativo.offsetWidth))
      marca.dataset.visivel = 'true'
      if (!haviaAtivo.current) {
        void marca.offsetWidth
        delete marca.dataset.salto
      }
      haviaAtivo.current = true
    }

    posicionar()
    window.addEventListener('resize', posicionar)
    return () => window.removeEventListener('resize', posicionar)
  }, [secaoAtiva, naHome, temBlog])

  // Ímã do menu (fator 0,25, ponteiro fino). O GSAP sai do JavaScript inicial:
  // este módulo só é baixado depois do carregamento, e só com mouse.
  useEffect(() => {
    const el = cabecalho.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return

    let ativo = true
    let desfazer: (() => void) | undefined
    import('@/lib/gsap').then(({ animar, ligarIma }) => {
      if (ativo) desfazer = animar(el, (contexto) => ligarIma(el, contexto))
    })

    return () => {
      ativo = false
      desfazer?.()
    }
  }, [])

  const fechar = () => setAberto(false)

  return (
    <>
      <a href="#main" className={styles.pular}>
        Skip to content
      </a>

      <header
        ref={cabecalho}
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
            <CodeXml className={styles.simbolo} size={26} strokeWidth={2.25} aria-hidden="true" />
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
              <ul ref={lista} className={styles.lista}>
                {MENU.filter((item) => item.id !== 'blog' || temBlog).map((item) => {
                  const atual = naHome && secaoAtiva === item.id
                  return (
                    <li key={item.id}>
                      <Link
                        href={naHome ? `#${item.id}` : `/#${item.id}`}
                        className={`t-pequeno ${styles.link}`}
                        aria-current={atual ? 'location' : undefined}
                        data-ima={0.25}
                        onClick={fechar}
                      >
                        {item.texto}
                      </Link>
                    </li>
                  )
                })}
                <span ref={indicador} className={styles.indicador} aria-hidden="true" data-visivel="false" />
              </ul>
            </nav>

            <ControlePausa />
          </div>
        </div>
      </header>
    </>
  )
}
