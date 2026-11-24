import {
  GitBranch,
  GitCommitHorizontal,
  Infinity as Infinito,
  Layers,
  type LucideIcon,
  PencilRuler,
  RefreshCw,
  Rocket,
  ScrollText,
  SquareKanban,
} from 'lucide-react'
import Image from 'next/image'
import {
  siAngular,
  siApachemaven,
  siAstro,
  siBetterauth,
  siBootstrap,
  siCloudflare,
  siCplusplus,
  siCss,
  siCypress,
  siDiscord,
  siDjango,
  siDocker,
  siDrizzle,
  siExpress,
  siFigma,
  siFlask,
  siFlyway,
  siGit,
  siGithub,
  siGithubactions,
  siGmail,
  siGrafana,
  siHtml5,
  siInstagram,
  siInsomnia,
  siJavascript,
  siJenkins,
  siJunit5,
  siLinux,
  siMercadopago,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPostgresql,
  siPostman,
  siPytest,
  siPython,
  siReact,
  siSelenium,
  siSpringboot,
  siSpringsecurity,
  siTailscale,
  siTailwindcss,
  siTanstack,
  siTerraform,
  siTrello,
  siTypescript,
  siVite,
  type SimpleIcon,
} from 'simple-icons'
import type { Icone } from '@/lib/tecnologias'
import styles from './IconeTecnologia.module.css'

// Import nomeado, um por ícone (ADR 0016): o pacote inteiro não entra no
// build. Slug novo em lib/tecnologias.ts ou content/perfil.ts pede a linha
// correspondente aqui; sem ela o build falha com o nome do slug.
const LOGOS: Record<string, SimpleIcon> = {
  angular: siAngular,
  apachemaven: siApachemaven,
  astro: siAstro,
  betterauth: siBetterauth,
  bootstrap: siBootstrap,
  cloudflare: siCloudflare,
  cplusplus: siCplusplus,
  css: siCss,
  cypress: siCypress,
  discord: siDiscord,
  django: siDjango,
  docker: siDocker,
  drizzle: siDrizzle,
  express: siExpress,
  figma: siFigma,
  flask: siFlask,
  flyway: siFlyway,
  git: siGit,
  github: siGithub,
  githubactions: siGithubactions,
  gmail: siGmail,
  grafana: siGrafana,
  html5: siHtml5,
  instagram: siInstagram,
  insomnia: siInsomnia,
  javascript: siJavascript,
  jenkins: siJenkins,
  junit5: siJunit5,
  linux: siLinux,
  mercadopago: siMercadopago,
  mysql: siMysql,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  npm: siNpm,
  postgresql: siPostgresql,
  postman: siPostman,
  pytest: siPytest,
  python: siPython,
  react: siReact,
  selenium: siSelenium,
  springboot: siSpringboot,
  springsecurity: siSpringsecurity,
  tailscale: siTailscale,
  tailwindcss: siTailwindcss,
  tanstack: siTanstack,
  terraform: siTerraform,
  trello: siTrello,
  typescript: siTypescript,
  vite: siVite,
}

// Ícones do Lucide dos métodos (não são marcas): a chave é o "nome" do registro.
const LUCIDE: Record<string, LucideIcon> = {
  layers: Layers,
  'git-branch': GitBranch,
  'refresh-cw': RefreshCw,
  'square-kanban': SquareKanban,
  rocket: Rocket,
  'pencil-ruler': PencilRuler,
  'git-commit-horizontal': GitCommitHorizontal,
  'scroll-text': ScrollText,
  infinity: Infinito,
}

// Fundo mais claro em que o ícone aparece (--surface-2 de tokens.css, que um SVG
// não lê). A cor da marca precisa de 3:1 contra ele (WCAG 1.4.11, gráficos): o
// preto do Next.js ou do GitHub, por exemplo, sumiria no fundo escuro.
const FUNDO_MAIS_CLARO = [0x1b, 0x2a, 0x3d]

function canais(hex: string): number[] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

function luminancia([r, g, b]: number[]): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contraste(a: number[], b: number[]): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

// Cor da marca pronta para o fundo escuro. Cinza (preto, grafite) não tem matiz
// para preservar e vira --ink; uma cor com matiz e pouco contraste (o azul do
// C++, o roxo do Insomnia) é clareada, em passos, até chegar a 3:1.
export function corVisivel(hex: string): string {
  const rgb = canais(hex)
  if (contraste(rgb, FUNDO_MAIS_CLARO) >= 3) return `#${hex.replace('#', '')}`
  if (Math.max(...rgb) - Math.min(...rgb) < 32) return 'var(--ink)'
  let atual = rgb
  for (let passo = 1; passo <= 20; passo++) {
    atual = rgb.map((v) => Math.round(v + (255 - v) * passo * 0.05))
    if (contraste(atual, FUNDO_MAIS_CLARO) >= 3) break
  }
  return `#${atual.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

type Props = {
  icone: Icone
  // Lado em px. Logo, imagem e monograma ocupam o mesmo quadrado, para a mistura
  // no mesmo tile não parecer quebrada.
  tamanho?: number
  // Monograma sem a borda própria, para quando o ícone já está dentro de um chip.
  semBorda?: boolean
}

// Decorativo: o nome da tecnologia vem sempre como texto ao lado.
export function IconeTecnologia({ icone, tamanho = 32, semBorda = false }: Props) {
  if (icone.tipo === 'monograma') {
    return (
      <span
        aria-hidden="true"
        className={`${styles.monograma} ${semBorda ? styles.semBorda : ''}`}
        style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho * 0.44) }}
      >
        {icone.texto}
      </span>
    )
  }

  if (icone.tipo === 'imagem') {
    // Logo colorido copiado para public/imagens/tecnologias/. Decorativo (alt vazio).
    return (
      <Image
        src={`/imagens/tecnologias/${icone.arquivo}.svg`}
        alt=""
        aria-hidden="true"
        width={tamanho}
        height={tamanho}
        // Inline porque um height: auto global esticava o que não é quadrado (o Java
        // saía com 32 x 43). O quadrado é fixo e a imagem cabe nele (object-fit).
        style={{ width: tamanho, height: tamanho }}
        className={styles.imagem}
      />
    )
  }

  if (icone.tipo === 'lucide') {
    const Desenho = LUCIDE[icone.nome]
    if (!Desenho) {
      throw new Error(`IconeTecnologia: ícone do Lucide "${icone.nome}" sem entrada em components/ui/IconeTecnologia.tsx`)
    }
    return (
      <Desenho
        aria-hidden="true"
        focusable="false"
        size={tamanho}
        strokeWidth={1.75}
        className={styles.logo}
        style={{ color: corVisivel(icone.cor) }}
      />
    )
  }

  const logo = LOGOS[icone.slug]
  if (!logo) {
    throw new Error(`IconeTecnologia: slug "${icone.slug}" sem import em components/ui/IconeTecnologia.tsx`)
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="currentColor"
      className={styles.logo}
      style={{ color: corVisivel(logo.hex) }}
    >
      <path d={logo.path} />
    </svg>
  )
}
