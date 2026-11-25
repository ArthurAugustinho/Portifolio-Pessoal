// Movimento do carrossel (Etapa 5): arrasto com inércia e o Flip entre o card e
// a prévia. Este módulo carrega por import dinâmico na
// primeira interação com a faixa (ADR 0013): Draggable, InertiaPlugin e Flip
// ficam fora do JavaScript inicial da home.
//
// Tudo passa por animar() (gsap.matchMedia): "reduzir movimento" e a pausa
// global desligam a inércia, e o Flip abre e fecha sem animação.

import { Draggable } from 'gsap/Draggable'
import { Flip } from 'gsap/Flip'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { animar, gsap, type Contexto } from '@/lib/gsap'
import { movimentoPausado } from '@/lib/movimento'

gsap.registerPlugin(Draggable, InertiaPlugin, Flip)

const DURACAO_FLIP = 0.45

// Depois de um arrasto, o navegador ainda dispara o click do card; o Carrossel
// pergunta aqui para não abrir a prévia no fim de um gesto de arrastar.
let arrastouAgora = false
export function acabouDeArrastar() {
  return arrastouAgora
}

// Arrasto com o mouse sobre a mesma rolagem nativa: trackpad, roda, toque e
// teclado continuam funcionando, porque a faixa segue sendo um overflow-x.
// Toque fica de fora (ponteiro grosso): é a rolagem nativa, com snap no CSS.
function ligarArrasto(faixa: HTMLElement, { pausado }: Contexto) {
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

// Liga o movimento da faixa. Devolve a limpeza.
export function iniciar(faixa: HTMLElement) {
  return animar(faixa, (contexto) => {
    if (!contexto.ponteiroFino) return
    return ligarArrasto(faixa, contexto)
  })
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
