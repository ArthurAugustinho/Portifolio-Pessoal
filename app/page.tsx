import Link from 'next/link'
import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import styles from './page.module.css'

export default function Home() {
  const destaques = ordenarProjetos(getProjetos())
    .filter((projeto) => projeto.destaque)
    .slice(0, 3)

  return (
    <>
      <div className={styles.wrapper}>
        <section id="hero" data-secao="Intro" aria-label="Intro" className={styles.hero}>
          <h1 className="t-hero">Arthur Augustinho</h1>
          <p className="t-lead">
            Full stack developer. I build web applications and network infrastructure.
          </p>
          <div className={styles.acoes}>
            <Link href="/projetos">View projects</Link>
            <Link href="/contato">Contact</Link>
          </div>
        </section>

        <section id="projetos" data-secao="Projects" aria-label="Projects">
          {destaques.length > 0 && (
            <div className={styles.grid}>
              {destaques.map((projeto) => (
                <ProjetoCard key={projeto.slug} projeto={projeto} nivelTitulo="h2" />
              ))}
            </div>
          )}
          <Link href="/projetos" className={`t-label ${styles.verTodos}`}>
            View all projects
          </Link>
        </section>

        <section id="contato" data-secao="Contact" aria-label="Contact">
          <p>
            Let’s talk? <Link href="/contato">Contact</Link>
          </p>
        </section>
      </div>
    </>
  )
}
