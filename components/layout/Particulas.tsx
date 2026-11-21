'use client'

import { useEffect, useRef } from 'react'
import { assinarMovimento, movimentoPausado } from '@/lib/movimento'
import styles from './Particulas.module.css'

// Fundo de partículas em canvas 2D próprio (ADR 0015, alternativa B). Fixo atrás
// de todas as páginas, decorativo e fora da interação. Parâmetros do esboço:
// até 80 partículas (30 no celular), ligação de 140 px, alcance do cursor de
// 170 px, velocidade de 0,25 px por quadro.

const LIGACAO = 140
const ALCANCE_DO_CURSOR = 170
const VELOCIDADE = 0.25
const RAIO = 1.6
const MAXIMO_DESKTOP = 80
const MAXIMO_CELULAR = 30
const MINIMO = 24
const LIMITE_DE_ALTURA = 1000
const AREA_POR_PARTICULA = 15000

type Particula = { x: number; y: number; vx: number; vy: number }

export function Particulas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const contexto = canvas?.getContext('2d')
    if (!canvas || !contexto) return

    const desenho = contexto
    const tela = canvas
    let ativo = true
    let quadro = 0
    let largura = 0
    let altura = 0
    let particulas: Particula[] = []
    const mouse = { x: -9999, y: -9999 }
    const fino = window.matchMedia('(pointer: fine)').matches
    // Cores dos tokens (nunca hex no componente): lidas uma vez, no início.
    let corDosPontos = ''
    let corDoCursor = ''

    const nova = (): Particula => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * VELOCIDADE,
      vy: (Math.random() - 0.5) * VELOCIDADE,
    })

    // Quantidade proporcional à área, com teto menor no celular.
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      largura = window.innerWidth
      altura = window.innerHeight
      tela.width = Math.round(largura * dpr)
      tela.height = Math.round(altura * dpr)
      desenho.setTransform(dpr, 0, 0, dpr, 0, 0)

      const teto = window.matchMedia('(max-width: 639px)').matches ? MAXIMO_CELULAR : MAXIMO_DESKTOP
      const alvo = Math.max(
        MINIMO,
        Math.min(teto, Math.round((largura * Math.min(altura, LIMITE_DE_ALTURA)) / AREA_POR_PARTICULA)),
      )
      while (particulas.length < alvo) particulas.push(nova())
      particulas = particulas.slice(0, alvo)
    }

    // Um quadro. `mover` false: parado (pausa ou "reduzir movimento"), sem
    // ligações ao cursor.
    const desenhar = (mover: boolean) => {
      desenho.clearRect(0, 0, largura, altura)
      desenho.lineWidth = 1
      const comCursor = mover && fino

      for (let i = 0; i < particulas.length; i++) {
        const a = particulas[i]
        if (mover) {
          a.x += a.vx
          a.y += a.vy
          if (a.x < 0 || a.x > largura) a.vx *= -1
          if (a.y < 0 || a.y > altura) a.vy *= -1
        }

        desenho.strokeStyle = corDosPontos
        for (let j = i + 1; j < particulas.length; j++) {
          const b = particulas[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LIGACAO) {
            desenho.globalAlpha = (1 - d / LIGACAO) * 0.6
            desenho.beginPath()
            desenho.moveTo(a.x, a.y)
            desenho.lineTo(b.x, b.y)
            desenho.stroke()
          }
        }

        if (comCursor) {
          const dc = Math.hypot(a.x - mouse.x, a.y - mouse.y)
          if (dc < ALCANCE_DO_CURSOR) {
            desenho.globalAlpha = (1 - dc / ALCANCE_DO_CURSOR) * 0.5
            desenho.strokeStyle = corDoCursor
            desenho.beginPath()
            desenho.moveTo(a.x, a.y)
            desenho.lineTo(mouse.x, mouse.y)
            desenho.stroke()
            desenho.strokeStyle = corDosPontos
          }
        }

        desenho.globalAlpha = 1
        desenho.fillStyle = corDosPontos
        desenho.beginPath()
        desenho.arc(a.x, a.y, RAIO, 0, Math.PI * 2)
        desenho.fill()
      }
    }

    const laco = () => {
      desenhar(true)
      quadro = requestAnimationFrame(laco)
    }

    const parar = () => {
      cancelAnimationFrame(quadro)
      quadro = 0
    }

    // Anda só com a aba visível e sem pausa; pausado, deixa um quadro parado.
    const atualizar = () => {
      if (!ativo) return
      parar()
      if (document.hidden) return
      if (movimentoPausado()) desenhar(false)
      else quadro = requestAnimationFrame(laco)
    }

    const aoMover = (evento: PointerEvent) => {
      mouse.x = evento.clientX
      mouse.y = evento.clientY
    }
    const aoSair = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    let esperaDoTamanho: ReturnType<typeof setTimeout> | undefined
    const aoRedimensionar = () => {
      clearTimeout(esperaDoTamanho)
      esperaDoTamanho = setTimeout(() => {
        ajustar()
        if (movimentoPausado()) desenhar(false)
      }, 150)
    }

    // Começa depois do primeiro paint útil, fora do caminho do LCP.
    const iniciar = () => {
      if (!ativo) return
      const estilo = getComputedStyle(document.documentElement)
      corDosPontos = estilo.getPropertyValue('--line-3').trim()
      corDoCursor = estilo.getPropertyValue('--ink-mute').trim()
      ajustar()
      atualizar()
    }

    let espera: number | ReturnType<typeof setTimeout>
    const temIdle = 'requestIdleCallback' in window
    if (temIdle) espera = window.requestIdleCallback(iniciar, { timeout: 2000 })
    else espera = setTimeout(iniciar, 200)

    const desassinar = assinarMovimento(atualizar)
    document.addEventListener('visibilitychange', atualizar)
    window.addEventListener('resize', aoRedimensionar)
    if (fino) {
      window.addEventListener('pointermove', aoMover)
      document.documentElement.addEventListener('pointerleave', aoSair)
    }

    return () => {
      ativo = false
      if (temIdle) window.cancelIdleCallback(espera as number)
      else clearTimeout(espera as ReturnType<typeof setTimeout>)
      parar()
      clearTimeout(esperaDoTamanho)
      desassinar()
      document.removeEventListener('visibilitychange', atualizar)
      window.removeEventListener('resize', aoRedimensionar)
      window.removeEventListener('pointermove', aoMover)
      document.documentElement.removeEventListener('pointerleave', aoSair)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.fundo} aria-hidden="true" />
}
