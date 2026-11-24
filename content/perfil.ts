// Perfil: única fonte dos textos da home e das partes de /sobre que se
// sobrepõem a ela (ADR 0018). Os textos em inglês são os aprovados no
// esboço (docs/redesign/home.md); não reescreva sem pedir ao autor.
//
// Tecnologias e ícones ficam em lib/tecnologias.ts; projetos, em
// content/projetos/*.mdx.

import { img, type CamadaId, type Icone } from '@/lib/tecnologias'

export const EMAIL = 'arthuraugustinho35@gmail.com'

export const perfil = {
  nome: { primeiro: 'Arthur', sobrenome: 'Augustinho' },

  status: 'Open to full-time roles in Europe',

  hero: {
    // Cinco trios, na ordem em que a linha de stacks percorre (Etapa 4).
    // Sem JavaScript, e com movimento pausado, aparece só o primeiro.
    trios: [
      ['Java', 'Spring Boot', 'PostgreSQL'],
      ['Next.js', 'React', 'TypeScript'],
      ['Node.js', 'Express', 'Docker'],
      ['Python', 'Django', 'Flask'],
      ['Angular', 'AWS', 'Terraform'],
    ],
    descricao:
      'Full-stack engineer who started in network operations. I build web applications end to end and design for latency and failure from the start.',
    legendaOrbita: 'A request travelling through the layers I work in.',
  },

  sobre: {
    titulo: 'From network operations to software.',
    paragrafos: [
      'I build web applications end to end: APIs in Java with Spring Boot or in Node.js, interfaces in Next.js and React, data in PostgreSQL.',
      'Before writing software full-time I spent sixteen months as a network analyst at Telgo Telecom, monitoring infrastructure with Zabbix and Grafana and handling critical incidents for business clients. That is where I learned to ask where a system fails before asking how it looks.',
      'I studied Software Engineering at UniEVANGÉLICA and I am now based in Europe.',
    ],
    ficha: [
      { id: 'desde', rotulo: 'Building software since', valor: '2022' },
      { id: 'redes', rotulo: 'Network operations', valor: '16 months, Telgo Telecom' },
      { id: 'formacao', rotulo: 'Degree', valor: 'Software Engineering, UniEVANGÉLICA' },
      { id: 'local', rotulo: 'Based in', valor: 'Europe, open to relocation' },
      { id: 'busca', rotulo: 'Looking for', valor: 'Full-time roles, remote or on-site' },
    ],
    linkHistoria: 'Read the full story',
  },

  stack: {
    titulo: 'What I work with, layer by layer.',
    subtitulo:
      'Tools and methods from my projects, my GitHub and my work at Telgo and at the university software factory.',
    // Ordem das camadas; o conteúdo de cada uma vem de lib/tecnologias.ts.
    camadas: ['interface', 'api', 'data', 'infrastructure', 'testing', 'tools', 'methods'] satisfies CamadaId[],
  },

  experiencia: {
    titulo: 'Where I have worked.',
    // Mais recente primeiro.
    cargos: [
      {
        cargo: 'Freelance developer',
        periodo: '2025–now',
        organizacao: 'Independent',
        pontos: [
          'Web applications for clients, from landing pages to a full e-commerce platform.',
          'Alexo: online store with Mercado Pago payments, Melhor Envio shipping and an order management panel, built solo.',
        ],
      },
      {
        cargo: 'Network analyst',
        periodo: '2024–2025',
        organizacao: 'Telgo Telecom',
        pontos: [
          'Monitored corporate network infrastructure with Zabbix and Grafana.',
          'Configured switches and routers.',
          'Handled critical incidents for business clients.',
        ],
      },
      {
        cargo: 'Full-stack developer',
        periodo: '2022–2024',
        organizacao: 'Fábrica de Tecnologias Turing, UniEVANGÉLICA',
        pontos: [
          'Worked on three systems: Psychology, Dentistry and Campus Security.',
          'Built APIs in Node.js, Django and Spring Boot, with PostgreSQL and SQL Server.',
          'Implemented authentication and access control.',
        ],
      },
    ],
  },

  projetos: {
    titulo: 'Projects I have built.',
    subtitulo: 'Drag or use the arrows to browse. Open a card for a short preview.',
  },

  blog: {
    titulo: 'Posts from LinkedIn.',
    subtitulo: 'What I am building, learning and reading.',
    linkTodos: 'See all posts',
  },

  contato: {
    titulo: 'Open to full-time roles in Europe.',
    texto: 'Based in Europe and open to relocation. Write to me about a role or a project.',
    github: 'https://github.com/ArthurAugustinho',
    linkedin: 'https://www.linkedin.com/in/arthur-augustinho-46076522b/',
    // TODO: [@ do Instagram]. Vazio, o bloco não aparece.
    instagram: '',
    // TODO: [usuário do Discord]. Vazio, o bloco não aparece. O Discord não
    // tem link público por nome de usuário: o bloco copia o usuário.
    discord: '',
  },
}

export type Cargo = (typeof perfil.experiencia.cargos)[number]

export type PerfilContato = {
  id: 'github' | 'linkedin' | 'instagram' | 'gmail' | 'discord'
  rotulo: string
  icone: Icone
  // Link externo; sem href, o bloco copia `copiar`.
  href?: string
  copiar?: string
}

// Blocos de contato na ordem da seção Contact. Instagram e Discord só entram
// quando o campo correspondente de perfil.contato estiver preenchido.
export function blocosDeContato(): PerfilContato[] {
  const { github, linkedin, instagram, discord } = perfil.contato
  const blocos: (PerfilContato | null)[] = [
    { id: 'github', rotulo: 'GitHub', icone: { tipo: 'simple-icons', slug: 'github' }, href: github },
    // LinkedIn não está no Simple Icons: logo colorido copiado para public/imagens/tecnologias/ (ADR 0016).
    { id: 'linkedin', rotulo: 'LinkedIn', icone: img('linkedin'), href: linkedin },
    instagram
      ? {
          id: 'instagram',
          rotulo: 'Instagram',
          icone: { tipo: 'simple-icons', slug: 'instagram' },
          href: `https://www.instagram.com/${instagram.replace(/^@/, '')}`,
        }
      : null,
    { id: 'gmail', rotulo: 'Gmail', icone: { tipo: 'simple-icons', slug: 'gmail' }, href: `mailto:${EMAIL}` },
    discord
      ? { id: 'discord', rotulo: 'Discord', icone: { tipo: 'simple-icons', slug: 'discord' }, copiar: discord }
      : null,
  ]
  return blocos.filter((bloco): bloco is PerfilContato => bloco !== null)
}
