'use client'

// Camada de movimento da home (ADR 0012: o estado estático vem primeiro). Estes
// componentes não desenham nada: ficam dentro do elemento que animam e montam o
// movimento por cima do HTML já completo. Revertido (pausa, "reduzir movimento"
// ou troca de página), a página volta exatamente ao estado estático.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAnimacaoNoPai, ligarIma, type Contexto } from '@/lib/gsap'

gsap.registerPlugin(ScrollTrigger)

// O nome é digitado uma vez por carregamento do site: voltar à home depois de
// navegar mostra o nome pronto e vai direto às stacks.
let nomeDigitado = false

const POR_LETRA_NOME = 0.095
const POR_LETRA_STACK = 0.06
const POR_LETRA_APAGAR = 0.028
const ESPERA_INICIAL = 0.4
const PAUSA_DEPOIS_DO_NOME = 0.6
const SEGURA_STACK = 1.8
const TROCA_DE_STACK = 0.38

type Texto = HTMLElement

// Tween que escreve `texto` letra a letra (ou apaga). `snap` mantém o contador
// inteiro: cada letra aparece no seu instante, sem meio-termo.
function escrever(elemento: Texto, texto: string, de: number, para: number, porLetra: number) {
  const estado = { n: de }
  return gsap.fromTo(
    estado,
    { n: de },
    {
      n: para,
      duration: Math.abs(para - de) * porLetra,
      ease: 'none',
      snap: { n: 1 },
      immediateRender: false,
      onUpdate: () => {
        const proximo = texto.slice(0, Math.round(estado.n))
        if (elemento.textContent !== proximo) elemento.textContent = proximo
      },
    },
  )
}

function montarDigitacao(escopo: HTMLElement, { pausado }: Contexto) {
  if (pausado) return

  const nome1 = escopo.querySelector<Texto>('[data-digita="nome-1"]')
  const nome2 = escopo.querySelector<Texto>('[data-digita="nome-2"]')
  const pilha = escopo.querySelector<Texto>('[data-digita="stacks"]')
  if (!nome1 || !nome2 || !pilha) return

  const cursorNome1 = escopo.querySelector<HTMLElement>('[data-cursor="nome-1"]')
  const cursorNome2 = escopo.querySelector<HTMLElement>('[data-cursor="nome-2"]')
  const cursorPilha = escopo.querySelector<HTMLElement>('[data-cursor="stacks"]')
  const trios: string[][] = JSON.parse(pilha.dataset.trios ?? '[]')
  const textos = { nome1: nome1.dataset.texto ?? '', nome2: nome2.dataset.texto ?? '' }
  const jaDigitou = nomeDigitado

  const mostrar = (cursor: HTMLElement | null, visivel: boolean) => {
    if (cursor) cursor.style.display = visivel ? 'inline-block' : ''
  }

  // Marca os trechos como em movimento: o CSS os mantém ocultos até aqui, para a
  // página não piscar o nome inteiro antes da digitação começar.
  const alvos = [nome1, nome2, pilha]
  alvos.forEach((alvo) => alvo.setAttribute('data-pronto', ''))
  if (!jaDigitou) {
    nome1.textContent = ''
    nome2.textContent = ''
  }
  pilha.textContent = ''

  const linha = gsap.timeline()

  if (!jaDigitou) {
    linha.call(() => mostrar(cursorNome1, true), undefined, 0)
    linha.add(escrever(nome1, textos.nome1, 0, textos.nome1.length, POR_LETRA_NOME), ESPERA_INICIAL)
    linha.call(() => {
      mostrar(cursorNome1, false)
      mostrar(cursorNome2, true)
    })
    linha.add(escrever(nome2, textos.nome2, 0, textos.nome2.length, POR_LETRA_NOME))
    linha.call(() => {
      mostrar(cursorNome2, false)
      nomeDigitado = true
    })
  }

  // Linha de stacks em loop: digita um trio, segura, apaga, troca.
  const volta = gsap.timeline({ repeat: -1 })
  trios.forEach((trio) => {
    const texto = trio.join(' / ')
    volta.add(escrever(pilha, texto, 0, texto.length, POR_LETRA_STACK))
    volta.add(escrever(pilha, texto, texto.length, 0, POR_LETRA_APAGAR), `+=${SEGURA_STACK}`)
    volta.to({}, { duration: TROCA_DE_STACK })
  })

  linha.call(() => mostrar(cursorPilha, true), undefined, jaDigitou ? 0 : `+=${PAUSA_DEPOIS_DO_NOME}`)
  linha.add(volta, '<')

  return () => {
    // O GSAP reverte estilos, não texto: devolve o HTML estático.
    nome1.textContent = textos.nome1
    nome2.textContent = textos.nome2
    pilha.textContent = pilha.dataset.texto ?? ''
    alvos.forEach((alvo) => alvo.removeAttribute('data-pronto'))
    ;[cursorNome1, cursorNome2, cursorPilha].forEach((cursor) => mostrar(cursor, false))
  }
}

function montarOrbita(escopo: HTMLElement, { pausado, ponteiroFino, celular, contextSafe }: Contexto) {
  const giro = escopo.querySelector<HTMLElement>('[data-giro]')
  const cena = escopo.querySelector<HTMLElement>('[data-cena]')
  if (pausado || !giro || !cena) return

  // O pacote dá uma volta em 14 s. Fora da tela, para: nada gira sem ser visto.
  const volta = gsap.to(giro, { rotation: 360, duration: 14, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    trigger: cena,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (gatilho) => (gatilho.isActive ? volta.play() : volta.pause()),
  })

  // Inclinação de até 6° pelo ponteiro (ADR 0014): só ponteiro fino, não no celular.
  if (!ponteiroFino || celular) return

  const inclinarX = gsap.quickTo(cena, 'rotationX', { duration: 0.6, ease: 'power3.out' })
  const inclinarY = gsap.quickTo(cena, 'rotationY', { duration: 0.6, ease: 'power3.out' })

  const mover = contextSafe((evento: PointerEvent) => {
    const retangulo = cena.getBoundingClientRect()
    const dx = (evento.clientX - (retangulo.left + retangulo.width / 2)) / (window.innerWidth / 2)
    const dy = (evento.clientY - (retangulo.top + retangulo.height / 2)) / (window.innerHeight / 2)
    inclinarY(gsap.utils.clamp(-1, 1, dx) * 6)
    inclinarX(gsap.utils.clamp(-1, 1, dy) * -6)
  }) as EventListener
  const soltar = contextSafe(() => {
    inclinarX(0)
    inclinarY(0)
  }) as EventListener

  escopo.addEventListener('pointermove', mover)
  escopo.addEventListener('pointerleave', soltar)
  return () => {
    escopo.removeEventListener('pointermove', mover)
    escopo.removeEventListener('pointerleave', soltar)
  }
}

// Hero: digitação do nome e loop das stacks, giro do pacote, inclinação da órbita
// e ímã dos botões.
export function MovimentoHero() {
  const marcador = useAnimacaoNoPai((hero, contexto) => {
    const limpezas = [
      montarDigitacao(hero, contexto),
      montarOrbita(hero, contexto),
      ligarIma(hero, contexto),
    ]
    return () => limpezas.forEach((limpar) => limpar?.())
  })

  return <span ref={marcador} hidden />
}

// Contato: ímã do botão de e-mail.
export function MovimentoIma() {
  const marcador = useAnimacaoNoPai((pai, contexto) => ligarIma(pai, contexto))
  return <span ref={marcador} hidden />
}

// Rota: a esfera desce a linha com o scroll, o trecho percorrido fica âmbar e
// cada nó alcançado acende. É resposta direta ao scroll, então continua com a
// pausa, só sem suavização.
function montarRota(trilho: HTMLElement, { pausado }: Contexto) {
  const linha = trilho.querySelector<HTMLElement>('[data-rota-linha]')
  const progresso = trilho.querySelector<HTMLElement>('[data-rota-progresso]')
  const esfera = trilho.querySelector<HTMLElement>('[data-rota-esfera]')
  const nos = Array.from(trilho.querySelectorAll<HTMLElement>('[data-rota-no]'))
  if (!linha || !progresso || !esfera) return

  let altura = 0
  let centros: number[] = []

  // Posição de cada nó ao longo da linha, em px a partir do primeiro nó.
  const medir = () => {
    altura = linha.offsetHeight
    const topo = linha.getBoundingClientRect().top
    centros = nos.map((no) => {
      const retangulo = no.getBoundingClientRect()
      return retangulo.top + retangulo.height / 2 - topo
    })
  }

  const acender = (fracao: number) => {
    const posicao = fracao * altura
    nos.forEach((no, indice) => {
      if (posicao + 1 >= centros[indice]) no.setAttribute('data-alcancado', '')
      else no.removeAttribute('data-alcancado')
    })
  }

  medir()

  const linhaDoTempo = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: trilho,
      start: 'top 45%',
      // Termina quando o fim da rota chega à base da janela: com o rodapé
      // embaixo, o fim da página sempre alcança esse ponto (a esfera chega ao fim).
      end: 'bottom bottom',
      // Pausado ou "reduzir movimento": sem suavização, a esfera cola no scroll.
      scrub: pausado ? true : 0.4,
      invalidateOnRefresh: true,
      onRefresh: (gatilho) => {
        medir()
        acender(gatilho.progress)
      },
      onUpdate: (gatilho) => acender(gatilho.progress),
    },
  })
  linhaDoTempo.fromTo(esfera, { y: 0 }, { y: () => altura }, 0)
  linhaDoTempo.fromTo(progresso, { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%' }, 0)

  return () => nos.forEach((no) => no.removeAttribute('data-alcancado'))
}

export function MovimentoRota() {
  const marcador = useAnimacaoNoPai((trilho, contexto) => montarRota(trilho, contexto))
  return <span ref={marcador} hidden />
}
