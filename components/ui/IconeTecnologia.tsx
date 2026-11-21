import {
  siAngular,
  siApachemaven,
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
  siTerraform,
  siTrello,
  siTypescript,
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
  terraform: siTerraform,
  trello: siTrello,
  typescript: siTypescript,
}

type Props = {
  icone: Icone
  // Lado em px. O logo e o monograma ocupam o mesmo quadrado, para a mistura
  // dos dois no mesmo tile não parecer quebrada.
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
    >
      <path d={logo.path} />
    </svg>
  )
}
