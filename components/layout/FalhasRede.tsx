'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { assinarMovimento, movimentoPausado } from '@/lib/movimento'
import styles from './FalhasRede.module.css'

// Falhas de rede que o cursor captura, no fundo da home. Não desenha a rede
// (isso é do Particulas): só as falhas, o HUD de órbita e a captura. Canvas 2D
// próprio, decorativo, só com ponteiro fino e movimento ativo.
//
// Tudo é integrado por dt (nunca por quadro): a velocidade é a mesma a 60 e a
// 120 Hz. O loop só roda com a aba visível e com o hero a 30% ou mais na tela,
// ou enquanto alguma falha ainda está ativa.

const MAXIMO_DE_FALHAS = 3
const ROTULOS = ['timeout', '503', '504', '502', 'ECONNRESET', 'packet loss', 'TTL exceeded', 'ETIMEDOUT']
const SUCESSO = '200 OK'
const EMBARALHAR = 'ABCDEF0123456789#/<>_'

const MARGEM_DE_NASCIMENTO = 24
const VELOCIDADE_MINIMA = 18
const VELOCIDADE_MAXIMA = 32
const ESPERA_MINIMA = 3
const ESPERA_MAXIMA = 6

const ALCANCE = 140
const ALCANCE_DE_ESCAPE = ALCANCE * 1.6
const VELOCIDADE_ANGULAR = 2.6
const RAIO_DA_ORBITA = 34
const TEMPO_EM_ORBITA = 1.2
const TEMPO_DE_CAPTURA = 0.9
const TROCA_DO_EMBARALHADO = 55
const VELOCIDADE_NA_TANGENTE = 26
const PASSO_MAXIMO = 50

type Estado = 'vaga' | 'orbita' | 'captura'

type Falha = {
  espaco: number
  rotulo: string
  x: number
  y: number
  vx: number
  vy: number
  estado: Estado
  entrou: boolean
  idade: number
  angulo: number
  raio: number
  tempoEmOrbita: number
  // Posição do cursor no instante da captura, e tempo decorrido nela.
  cx: number
  cy: number
  tempoDeCaptura: number
}

const aleatorio = (minimo: number, maximo: number) => minimo + Math.random() * (maximo - minimo)
const saidaCubica = (t: number) => 1 - (1 - t) ** 3

export function FalhasRede() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const procurarHero = useRef<() => void>(() => {})
  const caminho = usePathname()

  useEffect(() => {
    const canvas = canvasRef.current
    const contexto = canvas?.getContext('2d')
    if (!canvas || !contexto) return
    // Em toque não há cursor para capturar: nem registra nada.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const desenho = contexto
    const tela = canvas
    let ativo = true
    let quadro = 0
    let ultimo = 0
    let largura = 0
    let altura = 0
    let falhas: Falha[] = []
    // Uma espera (s) por vaga: depois de uma falha sair ou ser capturada, a
    // vaga só nasce de novo em 3 a 6 s. Começam escalonadas. Vazio até o loop
    // rodar de verdade: pausado ou em toque, nada sorteia.
    let esperas: number[] = []
    let heroVisivel = false
    const cursor = { x: -9999, y: -9999, dentro: false }
    let embaralhado = ''
    let ultimoEmbaralho = 0
    let cores = { erro: '', texto: '', destaque: '', linha: '', tinta: '', fonte: '' }

    const reiniciarEsperas = () => {
      esperas = Array.from({ length: MAXIMO_DE_FALHAS }, (_, i) => aleatorio(1, 3) + i * 1.5)
    }

    const limpar = () => desenho.clearRect(0, 0, largura, altura)

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      largura = window.innerWidth
      altura = window.innerHeight
      tela.width = Math.round(largura * dpr)
      tela.height = Math.round(altura * dpr)
      desenho.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const nova = (espaco: number): Falha => {
      const usados = new Set(falhas.map((falha) => falha.rotulo))
      const livres = ROTULOS.filter((rotulo) => !usados.has(rotulo))
      const rotulo = livres[Math.floor(Math.random() * livres.length)]

      // Numa borda aleatória, a 24px para fora, rumo a um ponto entre 20% e 80%.
      const borda = Math.floor(Math.random() * 4)
      const x = borda === 0 ? aleatorio(0, largura) : borda === 1 ? largura + MARGEM_DE_NASCIMENTO : borda === 2 ? aleatorio(0, largura) : -MARGEM_DE_NASCIMENTO
      const y = borda === 0 ? -MARGEM_DE_NASCIMENTO : borda === 1 ? aleatorio(0, altura) : borda === 2 ? altura + MARGEM_DE_NASCIMENTO : aleatorio(0, altura)
      const alvoX = aleatorio(largura * 0.2, largura * 0.8)
      const alvoY = aleatorio(altura * 0.2, altura * 0.8)
      const distancia = Math.hypot(alvoX - x, alvoY - y) || 1
      const velocidade = aleatorio(VELOCIDADE_MINIMA, VELOCIDADE_MAXIMA)

      return {
        espaco,
        rotulo,
        x,
        y,
        vx: ((alvoX - x) / distancia) * velocidade,
        vy: ((alvoY - y) / distancia) * velocidade,
        estado: 'vaga',
        entrou: false,
        idade: 0,
        angulo: 0,
        raio: 0,
        tempoEmOrbita: 0,
        cx: 0,
        cy: 0,
        tempoDeCaptura: 0,
      }
    }

    const remover = (falha: Falha) => {
      falhas = falhas.filter((item) => item !== falha)
      esperas[falha.espaco] = aleatorio(ESPERA_MINIMA, ESPERA_MAXIMA)
    }

    const deveRodar = () => !document.hidden && !movimentoPausado() && (heroVisivel || falhas.length > 0)

    // ---- Física -----------------------------------------------------------

    const atualizar = (dt: number) => {
      // Nascimentos: só com o hero visível.
      for (let espaco = 0; espaco < MAXIMO_DE_FALHAS; espaco++) {
        if (falhas.some((falha) => falha.espaco === espaco)) continue
        esperas[espaco] -= dt
        if (esperas[espaco] <= 0 && heroVisivel && falhas.length < MAXIMO_DE_FALHAS) falhas.push(nova(espaco))
      }

      const emOrbita = falhas.some((falha) => falha.estado !== 'vaga')
      // Uma falha por vez entra em órbita: a mais próxima, a menos de 140px.
      if (!emOrbita && cursor.dentro) {
        let alvo: Falha | null = null
        let menor = ALCANCE
        for (const falha of falhas) {
          const distancia = Math.hypot(falha.x - cursor.x, falha.y - cursor.y)
          if (distancia < menor) {
            menor = distancia
            alvo = falha
          }
        }
        if (alvo) {
          alvo.estado = 'orbita'
          alvo.angulo = Math.atan2(alvo.y - cursor.y, alvo.x - cursor.x)
          alvo.raio = menor
          alvo.tempoEmOrbita = 0
        }
      }

      for (const falha of [...falhas]) {
        falha.idade += dt

        if (falha.estado === 'vaga') {
          falha.x += falha.vx * dt
          falha.y += falha.vy * dt
          const dentro = falha.x > 0 && falha.x < largura && falha.y > 0 && falha.y < altura
          if (dentro) falha.entrou = true
          const margem = 40
          const fora =
            falha.x < -margem || falha.x > largura + margem || falha.y < -margem || falha.y > altura + margem
          // Saiu da tela depois de ter entrado; ou nunca entrou e já passou do razoável.
          if ((falha.entrou && fora) || (!falha.entrou && falha.idade > 20)) remover(falha)
        } else if (falha.estado === 'orbita') {
          const distancia = Math.hypot(falha.x - cursor.x, falha.y - cursor.y)
          if (!cursor.dentro || distancia > ALCANCE_DE_ESCAPE) {
            // Escapou: volta a vagar pela tangente da órbita.
            falha.estado = 'vaga'
            falha.vx = -Math.sin(falha.angulo) * VELOCIDADE_NA_TANGENTE
            falha.vy = Math.cos(falha.angulo) * VELOCIDADE_NA_TANGENTE
            falha.tempoEmOrbita = 0
            continue
          }
          falha.angulo += VELOCIDADE_ANGULAR * dt
          falha.raio += (RAIO_DA_ORBITA - falha.raio) * Math.min(1, 4 * dt)
          const alvoX = cursor.x + Math.cos(falha.angulo) * falha.raio
          const alvoY = cursor.y + Math.sin(falha.angulo) * falha.raio
          const suavizacao = Math.min(1, 10 * dt)
          falha.x += (alvoX - falha.x) * suavizacao
          falha.y += (alvoY - falha.y) * suavizacao
          falha.tempoEmOrbita += dt
          if (falha.tempoEmOrbita >= TEMPO_EM_ORBITA) {
            falha.estado = 'captura'
            falha.cx = cursor.x
            falha.cy = cursor.y
            falha.tempoDeCaptura = 0
          }
        } else {
          falha.tempoDeCaptura += dt
          if (falha.tempoDeCaptura >= TEMPO_DE_CAPTURA) remover(falha)
        }
      }
    }

    // ---- Desenho (linha fina, sem shadowBlur) ----------------------------

    const circulo = (x: number, y: number, raio: number, cor: string, alfa: number, espessura = 1) => {
      desenho.globalAlpha = alfa
      desenho.strokeStyle = cor
      desenho.lineWidth = espessura
      desenho.beginPath()
      desenho.arc(x, y, raio, 0, Math.PI * 2)
      desenho.stroke()
    }

    const texto = (conteudo: string, x: number, y: number, cor: string, alinhamento: CanvasTextAlign, alfa = 1) => {
      desenho.globalAlpha = alfa
      desenho.fillStyle = cor
      desenho.textAlign = alinhamento
      desenho.fillText(conteudo, x, y)
    }

    const ponto = (x: number, y: number, alfa = 1) => {
      desenho.globalAlpha = alfa
      desenho.fillStyle = cores.erro
      desenho.beginPath()
      desenho.arc(x, y, 2.5, 0, Math.PI * 2)
      desenho.fill()
    }

    const desenharFalha = (falha: Falha, agora: number) => {
      if (falha.estado === 'vaga') {
        ponto(falha.x, falha.y)
        texto(falha.rotulo, falha.x + 8, falha.y - 9, cores.texto, 'left')
        return
      }

      if (falha.estado === 'orbita') {
        // Linha do cursor até a falha.
        desenho.globalAlpha = 0.5
        desenho.strokeStyle = cores.destaque
        desenho.lineWidth = 1
        desenho.beginPath()
        desenho.moveTo(cursor.x, cursor.y)
        desenho.lineTo(falha.x, falha.y)
        desenho.stroke()

        circulo(cursor.x, cursor.y, 14, cores.linha, 0.9)

        // Arco de progresso, a partir de -90°.
        desenho.globalAlpha = 1
        desenho.strokeStyle = cores.destaque
        desenho.lineWidth = 1.5
        desenho.beginPath()
        desenho.arc(cursor.x, cursor.y, 24, -Math.PI / 2, -Math.PI / 2 + (falha.tempoEmOrbita / TEMPO_EM_ORBITA) * Math.PI * 2)
        desenho.stroke()

        // Círculo tracejado que gira devagar.
        desenho.setLineDash([3, 6])
        desenho.lineDashOffset = -agora * 0.03
        circulo(cursor.x, cursor.y, 50, cores.linha, 0.7)
        desenho.setLineDash([])
        desenho.lineDashOffset = 0

        ponto(falha.x, falha.y)
        // Rótulo para fora do anel, alinhado conforme o lado.
        const cosseno = Math.cos(falha.angulo)
        const alinhamento: CanvasTextAlign = cosseno > 0.3 ? 'left' : cosseno < -0.3 ? 'right' : 'center'
        texto(falha.rotulo, falha.x + cosseno * 22, falha.y + Math.sin(falha.angulo) * 22, cores.texto, alinhamento)
        return
      }

      // Captura: de 0 a 40% o anel abre e o rótulo embaralha até "200 OK"; de
      // 40 a 100% o anel achata e some, e o "200 OK" sobe e some.
      const progresso = falha.tempoDeCaptura / TEMPO_DE_CAPTURA
      const { cx, cy } = falha

      if (progresso < 0.4) {
        const q = progresso / 0.4
        const abertura = saidaCubica(q)
        circulo(cx, cy, 24 + (48 - 24) * abertura, cores.destaque, 1, 1.5)
        circulo(cx, cy, 14 * (1 - q) + 2 * q, cores.linha, 0.9)
        ponto(cx, cy, 1 - q)

        if (agora - ultimoEmbaralho >= TROCA_DO_EMBARALHADO) {
          ultimoEmbaralho = agora
          embaralhado = Array.from({ length: SUCESSO.length * 2 }, () => EMBARALHAR[Math.floor(Math.random() * EMBARALHAR.length)]).join('')
        }
        const resolvidos = Math.floor(q * SUCESSO.length)
        const comprimento = Math.round(falha.rotulo.length + (SUCESSO.length - falha.rotulo.length) * q)
        const exibido = Array.from({ length: comprimento }, (_, i) => (i < resolvidos ? SUCESSO[i] : embaralhado[i])).join('')
        texto(exibido, cx, cy - 48, cores.tinta, 'center')
        return
      }

      const r = (progresso - 0.4) / 0.6
      // Ease-in quadrático: de 1 a 0,04.
      const escalaY = 1 - (1 - 0.04) * r * r
      desenho.save()
      desenho.translate(cx, cy)
      desenho.scale(1, escalaY)
      circulo(0, 0, 48, cores.destaque, 1 - r, 1.5)
      desenho.restore()
      texto(SUCESSO, cx, cy - 48 - 10 * r, cores.tinta, 'center', r < 0.5 ? 1 : 1 - (r - 0.5) / 0.5)
    }

    const desenhar = (agora: number) => {
      limpar()
      desenho.font = `12px ${cores.fonte}`
      desenho.textBaseline = 'alphabetic'
      for (const falha of falhas) desenharFalha(falha, agora)
      desenho.globalAlpha = 1
    }

    // ---- Controle do loop ---------------------------------------------------

    const passo = (agora: number) => {
      quadro = 0
      if (!ativo) return
      const dt = Math.min(agora - ultimo, PASSO_MAXIMO) / 1000
      ultimo = agora
      atualizar(dt)
      desenhar(agora)
      if (deveRodar()) quadro = requestAnimationFrame(passo)
      else limpar()
    }

    const parar = () => {
      cancelAnimationFrame(quadro)
      quadro = 0
    }

    // Reavalia se o loop deve rodar: aba visível, sem pausa, hero visível ou
    // falha ativa. Pausar o movimento também descarta as falhas.
    const reavaliar = () => {
      if (!ativo) return
      if (movimentoPausado()) {
        parar()
        falhas = []
        esperas = []
        limpar()
        return
      }
      if (!deveRodar()) {
        parar()
        limpar()
        return
      }
      if (esperas.length === 0) reiniciarEsperas()
      if (!quadro) {
        ultimo = performance.now()
        quadro = requestAnimationFrame(passo)
      }
    }

    // ---- Entradas -------------------------------------------------------

    const aoMover = (evento: PointerEvent) => {
      cursor.x = evento.clientX
      cursor.y = evento.clientY
      cursor.dentro = true
    }
    const aoSair = () => {
      cursor.dentro = false
    }

    let esperaDoTamanho: ReturnType<typeof setTimeout> | undefined
    const aoRedimensionar = () => {
      clearTimeout(esperaDoTamanho)
      esperaDoTamanho = setTimeout(ajustar, 150)
    }

    let observador: IntersectionObserver | undefined
    let hero: Element | null = null
    const acharHero = () => {
      const atual = document.getElementById('top')
      if (atual === hero) return
      observador?.disconnect()
      hero = atual
      heroVisivel = false
      if (hero && observador) observador.observe(hero)
      reavaliar()
    }

    const iniciar = () => {
      if (!ativo) return
      // Cores dos tokens (nunca hex no componente): lidas uma vez, no início.
      const estilo = getComputedStyle(document.documentElement)
      cores = {
        erro: estilo.getPropertyValue('--error').trim(),
        texto: estilo.getPropertyValue('--ink-dim').trim(),
        destaque: estilo.getPropertyValue('--accent').trim(),
        linha: estilo.getPropertyValue('--line-ui').trim(),
        tinta: estilo.getPropertyValue('--ink').trim(),
        fonte: estilo.getPropertyValue('--font-mono').trim() || 'monospace',
      }
      ajustar()

      observador = new IntersectionObserver(
        (entradas) => {
          // isIntersecting vale com 1px na tela; o que conta é a fração do hero.
          heroVisivel = entradas.some((entrada) => entrada.intersectionRatio >= 0.3)
          reavaliar()
        },
        { threshold: 0.3 },
      )
      window.addEventListener('pointermove', aoMover)
      document.documentElement.addEventListener('pointerleave', aoSair)
      window.addEventListener('resize', aoRedimensionar)
      acharHero()
      reavaliar()
    }
    procurarHero.current = () => {
      if (observador) acharHero()
    }

    // Começa depois do primeiro paint útil, como o Particulas.
    let espera: number | ReturnType<typeof setTimeout>
    const temIdle = 'requestIdleCallback' in window
    if (temIdle) espera = window.requestIdleCallback(iniciar, { timeout: 2000 })
    else espera = setTimeout(iniciar, 200)

    const desassinar = assinarMovimento(reavaliar)
    document.addEventListener('visibilitychange', reavaliar)

    return () => {
      ativo = false
      procurarHero.current = () => {}
      if (temIdle) window.cancelIdleCallback(espera as number)
      else clearTimeout(espera as ReturnType<typeof setTimeout>)
      parar()
      clearTimeout(esperaDoTamanho)
      observador?.disconnect()
      desassinar()
      document.removeEventListener('visibilitychange', reavaliar)
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('resize', aoRedimensionar)
      document.documentElement.removeEventListener('pointerleave', aoSair)
    }
  }, [])

  // O layout não remonta entre páginas: ao chegar na home, o hero passa a existir.
  useEffect(() => {
    procurarHero.current()
  }, [caminho])

  return <canvas ref={canvasRef} className={styles.falhas} aria-hidden="true" />
}
