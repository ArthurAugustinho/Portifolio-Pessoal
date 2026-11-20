'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent, type KeyboardEvent, type ReactNode } from 'react'
import { movimentoPausado } from '@/lib/movimento'
import styles from './Carrossel.module.css'

type Props = {
  // Título e subtítulo da seção; as setas ficam à direita dele.
  cabecalho: ReactNode
  // Os <li> dos cards, já renderizados no servidor.
  cards: ReactNode
  // Prévia de cada projeto, por slug, também renderizada no servidor.
  previas: Record<string, ReactNode>
}

const DIRECOES = { ArrowLeft: -1, ArrowRight: 1 } as const

// Carrossel nativo: a rolagem horizontal é do navegador (toque, trackpad,
// teclado). Aqui entram só as setas, as setas do teclado e a prévia em <dialog>
// (ADR 0018). Arrasto com mouse e inércia vêm na Etapa 5.
export function Carrossel({ cabecalho, cards, previas }: Props) {
  const faixa = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLUListElement>(null)
  const dialogo = useRef<HTMLDialogElement>(null)
  const gatilho = useRef<HTMLElement | null>(null)
  const [noInicio, setNoInicio] = useState(true)
  const [noFim, setNoFim] = useState(false)
  const [aberta, setAberta] = useState<string | null>(null)

  // Estado das setas: lido na rolagem e quando o tamanho muda. O observer
  // também dispara uma vez ao começar a observar, então não há setState
  // síncrono dentro do efeito.
  useEffect(() => {
    const el = faixa.current
    if (!el) return

    const atualizar = () => {
      setNoInicio(el.scrollLeft <= 1)
      setNoFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
    }

    const observer = new ResizeObserver(atualizar)
    observer.observe(el)
    if (lista.current) observer.observe(lista.current)
    el.addEventListener('scroll', atualizar, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', atualizar)
    }
  }, [])

  // Com JavaScript o card abre uma prévia: o link passa a anunciar isso. Sem
  // JavaScript ele é um link comum, então o atributo não vai no HTML exportado.
  useEffect(() => {
    const links = lista.current?.querySelectorAll<HTMLAnchorElement>('a[data-previa]') ?? []
    links.forEach((link) => link.setAttribute('aria-haspopup', 'dialog'))
    return () => links.forEach((link) => link.removeAttribute('aria-haspopup'))
  }, [])

  useEffect(() => {
    const el = dialogo.current
    if (aberta && el && !el.open) {
      // Largura da barra de rolagem, lida antes de o CSS escondê-la.
      const raiz = document.documentElement
      raiz.style.setProperty('--largura-scroll', `${window.innerWidth - raiz.clientWidth}px`)
      el.showModal()
    }
  }, [aberta])

  function mover(direcao: -1 | 1) {
    const el = faixa.current
    const item = lista.current?.querySelector('li')
    if (!el || !item) return
    const espaco = parseFloat(getComputedStyle(lista.current!).columnGap) || 0
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({
      left: direcao * (item.getBoundingClientRect().width + espaco),
      behavior: reduzir || movimentoPausado() ? 'auto' : 'smooth',
    })
  }

  // Captura, para rodar antes do onClick do <Link>: o clique simples abre a
  // prévia; Ctrl, Cmd, Shift, Alt e botão do meio seguem o link normal (por
  // exemplo, abrir a página em outra aba).
  function aoClicar(evento: MouseEvent<HTMLUListElement>) {
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return
    }
    const link = (evento.target as HTMLElement).closest<HTMLAnchorElement>('a[data-previa]')
    if (!link) return
    evento.preventDefault()
    evento.stopPropagation()
    gatilho.current = link
    setAberta(link.dataset.previa ?? null)
  }

  function aoTeclar(evento: KeyboardEvent<HTMLDivElement>) {
    const direcao = DIRECOES[evento.key as keyof typeof DIRECOES]
    if (!direcao || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return
    evento.preventDefault()
    mover(direcao)
  }

  return (
    <>
      <div className={styles.topo}>
        <div>{cabecalho}</div>
        <div className={styles.setas}>
          <button
            type="button"
            className={styles.seta}
            aria-label="Previous project"
            disabled={noInicio}
            onClick={() => mover(-1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.seta}
            aria-label="Next project"
            disabled={noFim}
            onClick={() => mover(1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* tabIndex: a faixa recebe o foco do teclado para as setas ← → andarem
          um card, além do Tab que percorre os cards. */}
      <div
        ref={faixa}
        className={styles.faixa}
        role="region"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={aoTeclar}
      >
        <ul ref={lista} className={styles.lista} onClickCapture={aoClicar}>
          {cards}
        </ul>
      </div>

      <dialog
        ref={dialogo}
        className={styles.dialogo}
        aria-labelledby="previa-titulo"
        onClick={(evento) => {
          // Clique fora do conteúdo (no fundo) fecha.
          if (evento.target === evento.currentTarget) evento.currentTarget.close()
        }}
        onClose={() => {
          document.documentElement.style.removeProperty('--largura-scroll')
          setAberta(null)
          // O foco volta ao card, também no Safari, que não foca link ao clicar.
          gatilho.current?.focus()
        }}
      >
        {aberta ? previas[aberta] : null}
      </dialog>
    </>
  )
}
