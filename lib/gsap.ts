// Base do movimento (ADR 0013): um ponto só para o GSAP, o gsap.matchMedia() e a
// pausa global. Só componentes de cliente importam este módulo.
//
// Fica fora de lib/movimento.ts porque o layout (Server Component) importa o
// script anti-flash de lá, e este módulo puxa o GSAP e o React.
//
// O ScrollTrigger não é registrado aqui: quem precisa dele (a rota e a órbita)
// registra por conta própria, para o cabeçalho, que carrega este módulo sob
// demanda em todas as páginas, não pagar por ele.

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { assinarMovimento, movimentoPausado } from './movimento'

gsap.registerPlugin(useGSAP)

export { gsap }

export type Contexto = {
  // Estado da pausa global (ou "reduzir movimento" do sistema) no momento em
  // que a animação é montada. Pausado: monte só o que é resposta ao scroll.
  pausado: boolean
  ponteiroFino: boolean
  celular: boolean
  // Envolve funções criadas depois da montagem (eventos de ponteiro) para que o
  // GSAP as limpe junto com o resto.
  contextSafe: (funcao: (...argumentos: never[]) => unknown) => (...argumentos: never[]) => unknown
}

type Montagem = (contexto: Contexto) => void | (() => void)

// Alternar a pausa refaz toda animação montada: o GSAP reverte (estado estático
// de volta, nada fica pela metade) e roda de novo com o valor novo de `pausado`.
let ouvindoAPausa = false

function ouvirAPausa() {
  if (ouvindoAPausa) return
  ouvindoAPausa = true
  assinarMovimento(() => gsap.matchMediaRefresh())
}

// Monta animações em `escopo` dentro de gsap.matchMedia(). Devolve a limpeza.
// `sempre` existe porque, com um objeto de condições, o GSAP só roda a função se
// ao menos uma delas casar; um tablet sem ponteiro fino ficaria sem animação.
export function animar(escopo: Element, montar: Montagem): () => void {
  ouvirAPausa()
  const midia = gsap.matchMedia()

  midia.add(
    {
      sempre: 'all',
      reduzir: '(prefers-reduced-motion: reduce)',
      ponteiroFino: '(pointer: fine)',
      celular: '(max-width: 639px)',
    },
    (contexto, contextSafe) => {
      const condicoes = (contexto.conditions ?? {}) as Record<string, boolean>
      return montar({
        pausado: movimentoPausado(),
        ponteiroFino: Boolean(condicoes.ponteiroFino),
        celular: Boolean(condicoes.celular),
        contextSafe: contextSafe as unknown as Contexto['contextSafe'],
      })
    },
    escopo,
  )

  return () => midia.revert()
}

// Para componentes sem marcação própria que animam o elemento pai (a rota, o
// hero, o contato): renderize o `marcador` e o hook monta no elemento pai.
export function useAnimacaoNoPai(montar: (pai: HTMLElement, contexto: Contexto) => void | (() => void)) {
  const marcador = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const pai = marcador.current?.parentElement
      if (!pai) return
      return animar(pai, (contexto) => montar(pai, contexto))
    },
    { scope: marcador },
  )

  return marcador
}

const LIMITE_DO_IMA = 8

// Ímã (MASTER, "Movimento"): o elemento acompanha o ponteiro até 8px, com o
// fator de data-ima (0,25 menu, 0,3 botões, 0,2 e-mail). Só ponteiro fino e
// sem pausa; devolve a limpeza.
export function ligarIma(escopo: Element, { pausado, ponteiroFino, contextSafe }: Contexto) {
  if (pausado || !ponteiroFino) return

  const limpezas: (() => void)[] = []

  escopo.querySelectorAll<HTMLElement>('[data-ima]').forEach((elemento) => {
    const fator = Number(elemento.dataset.ima) || 0.25
    const irParaX = gsap.quickTo(elemento, 'x', { duration: 0.22, ease: 'power3.out' })
    const irParaY = gsap.quickTo(elemento, 'y', { duration: 0.22, ease: 'power3.out' })

    const mover = contextSafe((evento: PointerEvent) => {
      // O retângulo já inclui o deslocamento atual: tira, para o centro ser o
      // do elemento parado e o movimento não realimentar a si mesmo.
      const retangulo = elemento.getBoundingClientRect()
      const centroX = retangulo.left + retangulo.width / 2 - Number(gsap.getProperty(elemento, 'x'))
      const centroY = retangulo.top + retangulo.height / 2 - Number(gsap.getProperty(elemento, 'y'))
      irParaX(gsap.utils.clamp(-LIMITE_DO_IMA, LIMITE_DO_IMA, (evento.clientX - centroX) * fator))
      irParaY(gsap.utils.clamp(-LIMITE_DO_IMA, LIMITE_DO_IMA, (evento.clientY - centroY) * fator))
    }) as EventListener

    const soltar = contextSafe(() => {
      irParaX(0)
      irParaY(0)
    }) as EventListener

    elemento.addEventListener('pointermove', mover)
    elemento.addEventListener('pointerleave', soltar)
    limpezas.push(() => {
      elemento.removeEventListener('pointermove', mover)
      elemento.removeEventListener('pointerleave', soltar)
    })
  })

  return () => limpezas.forEach((limpar) => limpar())
}
