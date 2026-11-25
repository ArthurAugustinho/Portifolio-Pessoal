'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { assinarMovimento, movimentoPausado } from '@/lib/movimento'
import styles from './Carrossel.module.css'

type Props = {
  // Título e subtítulo da seção; as setas ficam à direita dele.
  cabecalho: ReactNode
  // Os <li> dos cards, já renderizados no servidor.
  cards: ReactNode
  // Prévia de cada projeto, por slug, também renderizada no servidor.
  previas: Record<string, ReactNode>
}

type Movimento = typeof import('./CarrosselMovimento')

const DIRECOES = { ArrowLeft: -1, ArrowRight: 1 } as const

// Vídeo do card: nunca com a pausa ligada nem com economia de dados.
function podeTocarVideo() {
  const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !movimentoPausado() && !conexao?.saveData
}

function pararVideo(video: HTMLVideoElement) {
  video.pause()
  video.removeAttribute('data-ativo')
}

// A rolagem horizontal é do navegador (toque, trackpad, roda, teclado). Aqui
// entram as setas, ← →, a prévia em <dialog> (ADR 0018) e o vídeo do card. O
// arrasto com inércia e o Flip carregam sob demanda, na primeira interação
// (CarrosselMovimento.ts).
export function Carrossel({ cabecalho, cards, previas }: Props) {
  const faixa = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLUListElement>(null)
  const dialogo = useRef<HTMLDialogElement>(null)
  const gatilho = useRef<HTMLElement | null>(null)
  const movimento = useRef<Movimento | null>(null)
  const desfazerMovimento = useRef<(() => void) | undefined>(undefined)
  const carregando = useRef(false)
  const fechando = useRef(false)
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

  // Ligar a pausa para qualquer vídeo de card que esteja tocando.
  useEffect(
    () =>
      assinarMovimento(() => {
        if (!movimentoPausado()) return
        lista.current
          ?.querySelectorAll<HTMLVideoElement>('video[data-video]')
          .forEach((video) => pararVideo(video))
      }),
    [],
  )

  // Limpeza do movimento carregado sob demanda.
  useEffect(
    () => () => {
      desfazerMovimento.current?.()
      desfazerMovimento.current = undefined
      movimento.current = null
      carregando.current = false
    },
    [],
  )

  // Primeira interação com a faixa (ponteiro em cima, foco num card ou toque):
  // baixa o Draggable, o InertiaPlugin e o Flip, uma vez só.
  function carregar() {
    if (carregando.current) return
    carregando.current = true
    void import('./CarrosselMovimento').then((modulo) => {
      // Se saiu da página enquanto baixava, `carregando` já foi zerado.
      if (!carregando.current || !faixa.current) return
      movimento.current = modulo
      desfazerMovimento.current = modulo.iniciar(faixa.current)
    })
  }

  useEffect(() => {
    const el = dialogo.current
    if (!aberta || !el || el.open) return

    // Largura da barra de rolagem, lida antes de o CSS escondê-la.
    const raiz = document.documentElement
    raiz.style.setProperty('--largura-scroll', `${window.innerWidth - raiz.clientWidth}px`)
    el.showModal()

    // O diálogo cresce a partir do card (Flip); sem o módulo carregado, ou com a
    // pausa, abre de uma vez.
    const card = gatilho.current?.closest('article')
    if (card) movimento.current?.abrirComFlip(el, card)
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
  // exemplo, abrir a página em outra aba). O fim de um arrasto não é clique.
  function aoClicar(evento: MouseEvent<HTMLUListElement>) {
    if (movimento.current?.acabouDeArrastar()) {
      evento.preventDefault()
      evento.stopPropagation()
      return
    }
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

  // Vídeo no hover e no foco: substitui a capa enquanto o ponteiro ou o foco
  // estiver no card. Sem src até o primeiro hover (preload none): nada baixa
  // antes disso.
  function tocar(card: Element | null) {
    const video = card?.querySelector<HTMLVideoElement>('video[data-video]')
    if (!video || !podeTocarVideo()) return
    if (!video.getAttribute('src')) video.src = video.dataset.src ?? ''
    video.setAttribute('data-ativo', '')
    void video.play().catch(() => pararVideo(video))
  }

  function parar(card: Element | null) {
    const video = card?.querySelector<HTMLVideoElement>('video[data-video]')
    if (video) pararVideo(video)
  }

  function aoPassar(evento: PointerEvent<HTMLUListElement>) {
    if (evento.pointerType !== 'mouse') return
    const card = (evento.target as Element).closest('article')
    if (card && !card.contains(evento.relatedTarget as Node | null)) tocar(card)
  }

  function aoSair(evento: PointerEvent<HTMLUListElement>) {
    const card = (evento.target as Element).closest('article')
    if (card && !card.contains(evento.relatedTarget as Node | null)) parar(card)
  }

  function aoFocar(evento: FocusEvent<HTMLElement>) {
    carregar()
    tocar((evento.target as Element).closest('article'))
  }

  function aoDesfocar(evento: FocusEvent<HTMLElement>) {
    const card = (evento.target as Element).closest('article')
    if (card && !card.contains(evento.relatedTarget as Node | null)) parar(card)
  }

  // Todo fechamento passa por aqui: Esc, clique no fundo e "Close". Com o Flip
  // carregado o diálogo volta ao card antes de fechar.
  function fechar() {
    const el = dialogo.current
    if (!el || !el.open || fechando.current) return
    fechando.current = true

    const encerrar = () => {
      fechando.current = false
      el.close()
    }
    const card = gatilho.current?.closest('article') ?? null
    if (!movimento.current?.fecharComFlip(el, card, encerrar)) encerrar()
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
        onFocus={aoFocar}
        onBlur={aoDesfocar}
        onPointerEnter={(evento) => {
          if (evento.pointerType === 'mouse') carregar()
        }}
      >
        <ul
          ref={lista}
          className={styles.lista}
          onClickCapture={aoClicar}
          onPointerOver={aoPassar}
          onPointerOut={aoSair}
        >
          {cards}
        </ul>
      </div>

      <dialog
        ref={dialogo}
        className={styles.dialogo}
        aria-labelledby="previa-titulo"
        onClick={(evento) => {
          // Clique fora do conteúdo (no fundo) fecha.
          if (evento.target === evento.currentTarget) fechar()
        }}
        onCancel={(evento) => {
          // Esc: o fechamento passa por fechar(), que pode animar.
          evento.preventDefault()
          fechar()
        }}
        onSubmit={(evento) => {
          // O "Close" é um <form method="dialog"> vindo do servidor.
          evento.preventDefault()
          fechar()
        }}
        onClose={() => {
          document.documentElement.style.removeProperty('--largura-scroll')
          if (dialogo.current) movimento.current?.limparDialogo(dialogo.current)
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
