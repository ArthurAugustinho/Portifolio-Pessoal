'use client'

import { useEffect } from 'react'

// Transição lateral das seções da home: os elementos marcados com data-revela
// que estão abaixo da tela entram deslizando pela esquerda, uma vez só. Não
// renderiza nada; só anima o que já está no HTML.
//
// - Só opacity e x (nunca visibility): o conteúdo escondido continua na ordem do
//   Tab, e o focusin revela na hora o que receber foco.
// - Só entra pela esquerda: sem deslocamento para a direita não há rolagem
//   horizontal.
// - Pausado ou "reduzir movimento": nada é escondido. A pausa durante a visita
//   reverte tudo (lib/gsap.ts refaz o que foi montado) e mostra o conteúdo.
// - O hero (LCP) e o carrossel ficam de fora: não levam data-revela.

const DISTANCIA = 40
const DISTANCIA_CELULAR = 24
const DURACAO = 0.7

export function RevelaLateral() {
  useEffect(() => {
    let ativo = true
    let desfazer: (() => void) | undefined

    // O GSAP e o ScrollTrigger vêm sob demanda, fora do JavaScript inicial.
    void Promise.all([import('@/lib/gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ animar, gsap }, { ScrollTrigger }]) => {
        const escopo = document.querySelector('main')
        if (!ativo || !escopo) return
        gsap.registerPlugin(ScrollTrigger)

        desfazer = animar(escopo, ({ pausado, celular, contextSafe }) => {
          if (pausado) return

          const distancia = celular ? DISTANCIA_CELULAR : DISTANCIA
          const alvos = gsap.utils.toArray<HTMLElement>('[data-revela]', escopo)
          // O que já está na tela ao montar não anima, para não piscar.
          const escondidos = alvos.filter((el) => el.getBoundingClientRect().top > window.innerHeight)
          if (escondidos.length === 0) return

          gsap.set(escondidos, { opacity: 0, x: -distancia })

          ScrollTrigger.batch(escondidos, {
            start: 'top 88%',
            once: true,
            onEnter: (lote) => {
              // Num pulo pelo menu, o lote traz também o que ficou para trás:
              // esses aparecem na hora, e só os visíveis fazem a entrada.
              const passados = lote.filter((el) => el.getBoundingClientRect().bottom < 0)
              const visiveis = lote.filter((el) => !passados.includes(el))
              if (passados.length) gsap.set(passados, { opacity: 1, x: 0 })
              if (visiveis.length) {
                gsap.to(visiveis, {
                  opacity: 1,
                  x: 0,
                  duration: DURACAO,
                  ease: 'power3.out',
                  stagger: Math.min(0.08, 0.4 / visiveis.length),
                  overwrite: true,
                })
              }
            },
          })

          // Foco (Tab) dentro de algo ainda escondido: revela na hora.
          const aoFocar = contextSafe((evento: FocusEvent) => {
            const alvo = (evento.target as Element | null)?.closest<HTMLElement>('[data-revela]')
            if (!alvo || Number(gsap.getProperty(alvo, 'opacity')) >= 1) return
            // overwrite: true encerra a entrada em andamento; killTweensOf não
            // alcançava o tween do lote (stagger) e a opacidade seguia subindo.
            gsap.set(alvo, { opacity: 1, x: 0, overwrite: true })
          }) as EventListener
          document.addEventListener('focusin', aoFocar)

          return () => document.removeEventListener('focusin', aoFocar)
        })
      },
    )

    return () => {
      ativo = false
      desfazer?.()
    }
  }, [])

  return null
}
