import Link from 'next/link'
import { FaixaStatus } from '@/components/layout/FaixaStatus'
import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import styles from './page.module.css'

// stack real deste site, conforme documentado em CLAUDE.md — não é uma
// lista genérica de habilidades, é o que constrói este portfólio.
const STACK = ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Vercel']

const SECOES = [
  { id: 'hero', nome: 'Início' },
  { id: 'stack', nome: 'Stack' },
  { id: 'projetos', nome: 'Projetos' },
  { id: 'contato', nome: 'Contato' },
]

export default function Home() {
  const destaques = ordenarProjetos(getProjetos())
    .filter((projeto) => projeto.destaque)
    .slice(0, 3)

  return (
    <>
      <FaixaStatus secoes={SECOES} />

      <div className={styles.wrapper}>
        <section id="hero" aria-label="Início" className={styles.hero}>
          <h1 className="t-hero">Arthur Augustinho</h1>
          <p className="t-lead">
            Desenvolvedor full stack. Construo aplicações web e infraestrutura de redes.
          </p>
          <div className={styles.acoes}>
            <Link href="/projetos">Ver projetos</Link>
            <Link href="/contato">Contato</Link>
          </div>
        </section>

        <section id="stack" aria-label="Stack">
          <p className="t-label">{STACK.join(' · ')}</p>
        </section>

        <section id="projetos" aria-label="Projetos">
          {destaques.length > 0 && (
            <div className={styles.grid}>
              {destaques.map((projeto) => (
                <ProjetoCard key={projeto.slug} projeto={projeto} nivelTitulo="h2" />
              ))}
            </div>
          )}
          <Link href="/projetos" className={`t-label ${styles.verTodos}`}>
            Ver todos os projetos
          </Link>
        </section>

        <section id="contato" aria-label="Contato">
          <p>
            Vamos conversar? <Link href="/contato">Contato</Link>
          </p>
        </section>
      </div>
    </>
  )
}
