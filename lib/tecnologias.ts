// Registro único de tecnologias (ADR 0016): nome, camada da seção Stack e ícone.
// A ordem do array é a ordem de exibição dentro de cada camada.
//
// Este módulo é só dados e não importa o pacote simple-icons: pode ser lido
// por qualquer componente, inclusive de cliente, sem levar os SVGs junto. O
// desenho de cada logo é resolvido em components/ui/IconeTecnologia.tsx.
//
// Sem logo no Simple Icons (marca excluída a pedido do dono: Java, AWS,
// Microsoft e o que não existe no pacote): monograma. Métodos não são marcas
// e também usam monograma.

export type Icone =
  | { tipo: 'simple-icons'; slug: string }
  | { tipo: 'monograma'; texto: string }

export const CAMADAS = [
  { id: 'interface', nome: 'Interface' },
  { id: 'api', nome: 'API' },
  { id: 'data', nome: 'Data' },
  { id: 'infrastructure', nome: 'Infrastructure' },
  { id: 'testing', nome: 'Testing' },
  { id: 'tools', nome: 'Tools' },
  { id: 'methods', nome: 'Methods' },
] as const

export type CamadaId = (typeof CAMADAS)[number]['id']

export type Tecnologia = {
  id: string
  nome: string
  camada: CamadaId
  icone: Icone
}

const logo = (slug: string): Icone => ({ tipo: 'simple-icons', slug })
const mono = (texto: string): Icone => ({ tipo: 'monograma', texto })

export const TECNOLOGIAS: readonly Tecnologia[] = [
  // Interface
  { id: 'nextjs', nome: 'Next.js', camada: 'interface', icone: logo('nextdotjs') },
  { id: 'react', nome: 'React', camada: 'interface', icone: logo('react') },
  { id: 'typescript', nome: 'TypeScript', camada: 'interface', icone: logo('typescript') },
  { id: 'angular', nome: 'Angular', camada: 'interface', icone: logo('angular') },
  { id: 'javascript', nome: 'JavaScript', camada: 'interface', icone: logo('javascript') },
  { id: 'html5', nome: 'HTML5', camada: 'interface', icone: logo('html5') },
  { id: 'css3', nome: 'CSS3', camada: 'interface', icone: logo('css') },
  { id: 'bootstrap', nome: 'Bootstrap', camada: 'interface', icone: logo('bootstrap') },
  { id: 'astro', nome: 'Astro', camada: 'interface', icone: logo('astro') },
  { id: 'tailwindcss', nome: 'Tailwind CSS', camada: 'interface', icone: logo('tailwindcss') },
  { id: 'tanstack-query', nome: 'TanStack Query', camada: 'interface', icone: logo('tanstack') },

  // API
  { id: 'java', nome: 'Java', camada: 'api', icone: mono('Jv') },
  { id: 'spring-boot', nome: 'Spring Boot', camada: 'api', icone: logo('springboot') },
  { id: 'spring-security', nome: 'Spring Security', camada: 'api', icone: logo('springsecurity') },
  { id: 'nodejs', nome: 'Node.js', camada: 'api', icone: logo('nodedotjs') },
  { id: 'express', nome: 'Express', camada: 'api', icone: logo('express') },
  { id: 'django', nome: 'Django', camada: 'api', icone: logo('django') },
  { id: 'flask', nome: 'Flask', camada: 'api', icone: logo('flask') },
  { id: 'python', nome: 'Python', camada: 'api', icone: logo('python') },
  { id: 'cpp', nome: 'C++', camada: 'api', icone: logo('cplusplus') },
  { id: 'better-auth', nome: 'Better Auth', camada: 'api', icone: logo('betterauth') },
  { id: 'mercado-pago', nome: 'Mercado Pago', camada: 'api', icone: logo('mercadopago') },

  // Data
  { id: 'postgresql', nome: 'PostgreSQL', camada: 'data', icone: logo('postgresql') },
  { id: 'flyway', nome: 'Flyway', camada: 'data', icone: logo('flyway') },
  { id: 'sql-server', nome: 'SQL Server', camada: 'data', icone: mono('Sq') },
  { id: 'drizzle', nome: 'Drizzle ORM', camada: 'data', icone: logo('drizzle') },
  { id: 'mysql', nome: 'MySQL', camada: 'data', icone: logo('mysql') },

  // Infrastructure
  { id: 'docker', nome: 'Docker', camada: 'infrastructure', icone: logo('docker') },
  { id: 'aws-ecs-fargate', nome: 'AWS ECS Fargate', camada: 'infrastructure', icone: mono('Aw') },
  { id: 'cloudflare', nome: 'Cloudflare', camada: 'infrastructure', icone: logo('cloudflare') },
  { id: 'zabbix', nome: 'Zabbix', camada: 'infrastructure', icone: mono('Zb') },
  { id: 'grafana', nome: 'Grafana', camada: 'infrastructure', icone: logo('grafana') },
  { id: 'terraform', nome: 'Terraform', camada: 'infrastructure', icone: logo('terraform') },
  { id: 'linux', nome: 'Linux', camada: 'infrastructure', icone: logo('linux') },
  { id: 'tailscale', nome: 'Tailscale', camada: 'infrastructure', icone: logo('tailscale') },
  { id: 'jenkins', nome: 'Jenkins', camada: 'infrastructure', icone: logo('jenkins') },
  { id: 'github-actions', nome: 'GitHub Actions', camada: 'infrastructure', icone: logo('githubactions') },

  // Testing
  { id: 'junit-mockito', nome: 'JUnit and Mockito', camada: 'testing', icone: logo('junit5') },
  { id: 'selenium', nome: 'Selenium', camada: 'testing', icone: logo('selenium') },
  { id: 'cypress', nome: 'Cypress', camada: 'testing', icone: logo('cypress') },
  { id: 'pytest', nome: 'Pytest', camada: 'testing', icone: logo('pytest') },
  { id: 'postman', nome: 'Postman', camada: 'testing', icone: logo('postman') },
  { id: 'insomnia', nome: 'Insomnia', camada: 'testing', icone: logo('insomnia') },

  // Tools
  { id: 'git', nome: 'Git', camada: 'tools', icone: logo('git') },
  { id: 'github', nome: 'GitHub', camada: 'tools', icone: logo('github') },
  { id: 'vscode', nome: 'VS Code', camada: 'tools', icone: mono('Vs') },
  { id: 'figma', nome: 'Figma', camada: 'tools', icone: logo('figma') },
  { id: 'trello', nome: 'Trello', camada: 'tools', icone: logo('trello') },
  { id: 'maven', nome: 'Maven', camada: 'tools', icone: logo('apachemaven') },
  { id: 'npm', nome: 'npm', camada: 'tools', icone: logo('npm') },
  { id: 'vite', nome: 'Vite', camada: 'tools', icone: logo('vite') },

  // Methods
  { id: 'clean-architecture', nome: 'Clean Architecture', camada: 'methods', icone: mono('Ca') },
  { id: 'gitflow', nome: 'Gitflow', camada: 'methods', icone: mono('Gf') },
  { id: 'scrum', nome: 'Scrum', camada: 'methods', icone: mono('Sc') },
  { id: 'kanban', nome: 'Kanban', camada: 'methods', icone: mono('Kb') },
  { id: 'mvp', nome: 'MVP', camada: 'methods', icone: mono('Mp') },
  { id: 'prototyping', nome: 'Prototyping', camada: 'methods', icone: mono('Pr') },
  { id: 'conventional-commits', nome: 'Conventional Commits', camada: 'methods', icone: mono('Cc') },
  { id: 'adrs', nome: 'ADRs', camada: 'methods', icone: mono('Ad') },
  { id: 'ci-cd', nome: 'CI/CD', camada: 'methods', icone: mono('Ci') },
]

const POR_ID = new Map(TECNOLOGIAS.map((tecnologia) => [tecnologia.id, tecnologia]))

export function tecnologiaPorId(id: string): Tecnologia | undefined {
  return POR_ID.get(id)
}

export function tecnologiasDaCamada(camada: CamadaId): Tecnologia[] {
  return TECNOLOGIAS.filter((tecnologia) => tecnologia.camada === camada)
}

// Nomes na ordem dos ids. Os ids de um projeto já foram validados em lib/projetos.ts.
export function nomesDasTecnologias(ids: string[]): string[] {
  return ids.flatMap((id) => {
    const tecnologia = tecnologiaPorId(id)
    return tecnologia ? [tecnologia.nome] : []
  })
}
