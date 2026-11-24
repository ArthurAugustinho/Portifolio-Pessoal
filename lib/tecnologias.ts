// Registro único de tecnologias (ADR 0016): nome, camada da seção Stack e ícone.
// A ordem do array é a ordem de exibição dentro de cada camada.
//
// Este módulo é só dados e não importa o pacote simple-icons: pode ser lido
// por qualquer componente, inclusive de cliente, sem levar os SVGs junto. O
// desenho de cada logo é resolvido em components/ui/IconeTecnologia.tsx.
//
// Todo ícone aparece na cor da marca (ADR 0016, atualização de 2026-11-23). Há
// quatro tipos:
//   simple-icons  logo do pacote Simple Icons, com a cor da marca do próprio pacote;
//   imagem        logo colorido copiado para public/imagens/tecnologias/, para as
//                 marcas que o Simple Icons não tem (Java, AWS, Microsoft, Zabbix...);
//   lucide        ícone do Lucide com cor de apoio, para os métodos, que não são marcas;
//   monograma     reserva, sem uso hoje.
// A cor é ajustada no componente quando ficaria apagada sobre o fundo escuro.

export type Icone =
  | { tipo: 'simple-icons'; slug: string }
  | { tipo: 'imagem'; arquivo: string }
  | { tipo: 'lucide'; nome: string; cor: string }
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
// arquivo: nome do SVG em public/imagens/tecnologias/ (sem a extensão).
export const img = (arquivo: string): Icone => ({ tipo: 'imagem', arquivo })
// nome: chave do ícone em components/ui/IconeTecnologia.tsx.
const lucide = (nome: string, cor: string): Icone => ({ tipo: 'lucide', nome, cor })

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
  { id: 'java', nome: 'Java', camada: 'api', icone: img('java') },
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
  { id: 'sql-server', nome: 'SQL Server', camada: 'data', icone: img('sql-server') },
  { id: 'drizzle', nome: 'Drizzle ORM', camada: 'data', icone: logo('drizzle') },
  { id: 'mysql', nome: 'MySQL', camada: 'data', icone: logo('mysql') },

  // Infrastructure
  { id: 'docker', nome: 'Docker', camada: 'infrastructure', icone: logo('docker') },
  { id: 'aws-ecs-fargate', nome: 'AWS ECS Fargate', camada: 'infrastructure', icone: img('aws-ecs-fargate') },
  { id: 'cloudflare', nome: 'Cloudflare', camada: 'infrastructure', icone: logo('cloudflare') },
  { id: 'zabbix', nome: 'Zabbix', camada: 'infrastructure', icone: img('zabbix') },
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
  { id: 'vscode', nome: 'VS Code', camada: 'tools', icone: img('vscode') },
  { id: 'figma', nome: 'Figma', camada: 'tools', icone: logo('figma') },
  { id: 'trello', nome: 'Trello', camada: 'tools', icone: logo('trello') },
  { id: 'maven', nome: 'Maven', camada: 'tools', icone: logo('apachemaven') },
  { id: 'npm', nome: 'npm', camada: 'tools', icone: logo('npm') },
  { id: 'vite', nome: 'Vite', camada: 'tools', icone: logo('vite') },

  // Methods
  { id: 'clean-architecture', nome: 'Clean Architecture', camada: 'methods', icone: lucide('layers', '#2DD4BF') },
  { id: 'gitflow', nome: 'Gitflow', camada: 'methods', icone: lucide('git-branch', '#F05133') },
  { id: 'scrum', nome: 'Scrum', camada: 'methods', icone: lucide('refresh-cw', '#38BDF8') },
  { id: 'kanban', nome: 'Kanban', camada: 'methods', icone: lucide('square-kanban', '#A78BFA') },
  { id: 'mvp', nome: 'MVP', camada: 'methods', icone: lucide('rocket', '#FB7185') },
  { id: 'prototyping', nome: 'Prototyping', camada: 'methods', icone: lucide('pencil-ruler', '#A3E635') },
  { id: 'conventional-commits', nome: 'Conventional Commits', camada: 'methods', icone: lucide('git-commit-horizontal', '#FE5196') },
  { id: 'adrs', nome: 'ADRs', camada: 'methods', icone: lucide('scroll-text', '#34D399') },
  { id: 'ci-cd', nome: 'CI/CD', camada: 'methods', icone: lucide('infinity', '#60A5FA') },
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
