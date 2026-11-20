// Movimento do carrossel (Etapa 5): arrasto com inércia, cursor "Drag" e "Open"
// e o Flip entre o card e a prévia. Este módulo carrega por import dinâmico na
// primeira interação com a faixa (ADR 0013): Draggable, InertiaPlugin e Flip
// ficam fora do JavaScript inicial da home.
//
// Tudo passa por animar() (gsap.matchMedia): "reduzir movimento" e a pausa
// global desligam o cursor e a inércia, e o Flip abre e fecha sem animação.

import { Draggable } from 'gsap/Draggable'
import { Flip } from 'gsap/Flip'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { animar, gsap, type Contexto } from '@/lib/gsap'
import { movimentoPausado } from '@/lib/movimento'

gsap.registerPlugin(Draggable, InertiaPlugin, Flip)

const DURACAO_FLIP = 0.45

type Elementos = {
  faixa: HTMLElement
  cursor: HTMLElement
}

// Depois de um arrasto, o navegador ainda dispara o click do card; o Carrossel
// pergunta aqui para não abrir a prévia no fim de um gesto de arrastar.
let arrastouAgora = false
export function acabouDeArrastar() {
  return arrastouAgora
}

// Arrasto com o mouse sobre a mesma rolagem nativa: trackpad, roda, toque e
// teclado continuam funcionando, porque a faixa segue sendo um overflow-x.
// Toque fica de fora (ponteiro grosso): é a rolagem nativa, com snap no CSS.
function ligarArrasto({ faixa, cursor }: Elementos, { pausado }: Contexto) {
  faixa.setAttribute('data-arrasto', '')

  const [arrastavel] = Draggable.create(faixa, {
    type: 'scrollLeft',
    // Pausado ou "reduzir movimento": arrasta, mas sem inércia.
    inertia: !pausado,
    minimumMovement: 6,
    allowNativeTouchScrolling: true,
    onDragStart: () => {
      arrastouAgora = true
      faixa.setAttribute('data-arrastando', '')
      // Ao começar a arrastar, o cursor passa a dizer "Drag" mesmo sobre um card.
      const rotulo = cursor.querySelector('[data-rotulo]')
      if (rotulo) rotulo.textContent = 'Drag'
    },
    onRelease: () => {
      faixa.removeAttribute('data-arrastando')
      // O click vem logo depois do mouseup, na mesma tarefa: solta no seguinte.
      setTimeout(() => {
        arrastouAgora = false
      }, 0)
    },
  })

  return () => {
    arrastavel.kill()
    faixa.removeAttribute('data-arrasto')
    faixa.removeAttribute('data-arrastando')
    arrastouAgora = false
  }
}

// Rótulo que acompanha o ponteiro: "Drag" sobre a faixa, "Open" sobre um card.
// Decorativo, só ponteiro fino e sem pausa; o cursor nativo continua visível.
function ligarCursor(
  { faixa, cursor }: Elementos,
  { contextSafe }: Contexto,
  ponto: { x: number; y: number } | null,
) {
  const rotulo = cursor.querySelector<HTMLElement>('[data-rotulo]')
  if (!rotulo) return

  const irParaX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' })
  const irParaY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' })
  gsap.set(cursor, { autoAlpha: 0, scale: 0.6 })

  const mostrar = contextSafe(() =>
    gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' }),
  ) as () => void
  const esconder = contextSafe(() =>
    gsap.to(cursor, { autoAlpha: 0, scale: 0.6, duration: 0.15, ease: 'power2.out', overwrite: 'auto' }),
  ) as () => void

  const seguir = (evento: { clientX: number; clientY: number; target: EventTarget | null }) => {
    irParaX(evento.clientX)
    irParaY(evento.clientY)
    // Arrastando, o rótulo é sempre "Drag"; fora disso, "Open" só sobre um card.
    const sobreCard =
      !faixa.hasAttribute('data-arrastando') &&
      (evento.target as Element | null)?.closest('a[data-previa], article')
    const texto = sobreCard ? 'Open' : 'Drag'
    if (rotulo.textContent !== texto) rotulo.textContent = texto
  }

  const entrar = contextSafe((evento: PointerEvent) => {
    seguir(evento)
    mostrar()
  }) as EventListener
  const mover = contextSafe((evento: PointerEvent) => seguir(evento)) as EventListener
  const sair = contextSafe(() => esconder()) as EventListener

  faixa.addEventListener('pointerenter', entrar)
  faixa.addEventListener('pointermove', mover)
  faixa.addEventListener('pointerleave', sair)

  // O módulo carrega com o ponteiro já em cima da faixa: não perde o primeiro
  // pointerenter.
  if (ponto) {
    seguir({ clientX: ponto.x, clientY: ponto.y, target: document.elementFromPoint(ponto.x, ponto.y) })
    mostrar()
  }

  return () => {
    faixa.removeEventListener('pointerenter', entrar)
    faixa.removeEventListener('pointermove', mover)
    faixa.removeEventListener('pointerleave', sair)
  }
}

// Liga o movimento da faixa. Devolve a limpeza.
export function iniciar(elementos: Elementos, ponto: { x: number; y: number } | null) {
  return animar(elementos.faixa, (contexto) => {
    if (!contexto.ponteiroFino) return

    const limpezas: (void | (() => void))[] = [ligarArrasto(elementos, contexto)]
    if (!contexto.pausado) limpezas.push(ligarCursor(elementos, contexto, ponto))
    return () => limpezas.forEach((limpar) => limpar?.())
  })
}

// O cursor some enquanto a prévia está aberta.
export function esconderCursor({ cursor }: Pick<Elementos, 'cursor'>) {
  gsap.to(cursor, { autoAlpha: 0, scale: 0.6, duration: 0.1, overwrite: 'auto' })
}

// Flip: o <dialog> cresce a partir do card (e volta a ele ao fechar). Com a
// pausa ou "reduzir movimento" nada disto roda e o diálogo abre e fecha de uma vez.
export function abrirComFlip(dialogo: HTMLDialogElement, card: Element) {
  if (movimentoPausado()) return

  gsap.killTweensOf(dialogo)
  // Encaixa o diálogo, já aberto, sobre o retângulo do card (sem animar)...
  Flip.fit(dialogo, card, { scale: true })
  // ...e solta para o tamanho e a posição finais.
  gsap.to(dialogo, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: DURACAO_FLIP,
    ease: 'power3.inOut',
    onComplete: () => gsap.set(dialogo, { clearProps: 'transform' }),
  })
  // O conteúdo aparece na segunda metade, para não ver o texto espremido.
  gsap.fromTo(
    dialogo.firstElementChild,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: DURACAO_FLIP / 2, delay: DURACAO_FLIP / 3, ease: 'power1.out' },
  )
}

// Devolve true se vai animar (e chamará `aoTerminar` no fim); false se o
// chamador deve fechar na hora.
export function fecharComFlip(dialogo: HTMLDialogElement, card: Element | null, aoTerminar: () => void) {
  if (movimentoPausado() || !card || !card.isConnected) return false

  gsap.killTweensOf(dialogo)
  gsap.to(dialogo.firstElementChild, { autoAlpha: 0, duration: DURACAO_FLIP / 2, ease: 'power1.in' })
  Flip.fit(dialogo, card, {
    scale: true,
    duration: DURACAO_FLIP,
    ease: 'power3.inOut',
    onComplete: aoTerminar,
  })
  return true
}

// Depois de fechar: devolve o diálogo ao estado limpo para a próxima abertura.
export function limparDialogo(dialogo: HTMLDialogElement) {
  gsap.killTweensOf(dialogo)
  gsap.set(dialogo, { clearProps: 'transform,opacity,visibility' })
  if (dialogo.firstElementChild) {
    gsap.killTweensOf(dialogo.firstElementChild)
    gsap.set(dialogo.firstElementChild, { clearProps: 'opacity,visibility' })
  }
}
