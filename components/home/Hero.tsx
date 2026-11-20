import { Botao } from '@/components/ui/Botao'
import { Retrato } from '@/components/ui/Retrato'
import { perfil } from '@/content/perfil'
import styles from './Hero.module.css'

// Nós da órbita: uma requisição atravessando as camadas (ADR 0014). A posição
// de cada nó e do rótulo vem do CSS (classes por lado).
const NOS = [
  { lado: 'topo', rotulo: 'Browser' },
  { lado: 'direita', rotulo: 'Network edge' },
  { lado: 'base', rotulo: 'API' },
  { lado: 'esquerda', rotulo: 'Database' },
] as const

// Estado estático (Etapa 2): nome completo, primeiro trio de stacks e órbita
// parada. A digitação, o loop de stacks e o giro do pacote entram na Etapa 4,
// por cima deste mesmo HTML.
export function Hero() {
  const { nome, status, hero } = perfil
  const nomeCompleto = `${nome.primeiro} ${nome.sobrenome}`
  // Leitor de tela lê as 15 tecnologias uma vez cada; o texto visível (e,
  // depois, digitado) fica aria-hidden.
  const todasAsStacks = hero.trios.flat().join(', ')

  return (
    <section id="top" aria-labelledby="hero-titulo" data-secao="" className={styles.hero}>
      <div className={styles.conteudo}>
        <div className={styles.texto}>
          <p className={styles.chip}>
            <span className={styles.ponto} aria-hidden="true" />
            {status}
          </p>

          <h1 id="hero-titulo" className={`t-hero ${styles.titulo}`}>
            <span className="sr-only">{nomeCompleto}</span>
            <span aria-hidden="true" className={styles.linha}>
              {nome.primeiro}
            </span>
            <span aria-hidden="true" className={`${styles.linha} ${styles.sobrenome}`}>
              {nome.sobrenome}.
            </span>
          </h1>

          <p className={`t-stack ${styles.stacks}`}>
            <span aria-hidden="true">{hero.trios[0].join(' / ')}</span>
            <span className="sr-only">{todasAsStacks}</span>
          </p>

          <p className={styles.descricao}>{hero.descricao}</p>

          <div className={styles.botoes}>
            <Botao href="#projects" variante="primario">
              See the projects
            </Botao>
            <Botao href={perfil.contato.github} externo>
              GitHub
            </Botao>
            <Botao href={perfil.contato.linkedin} externo>
              LinkedIn
            </Botao>
          </div>
        </div>

        <figure className={styles.orbita} aria-labelledby="orbita-legenda">
          <div className={styles.cena}>
            <svg aria-hidden="true" viewBox="0 0 460 460" className={`${styles.anel} ${styles.anelInterno}`}>
              <circle cx="230" cy="230" r="156" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 460 460" className={`${styles.anel} ${styles.anelExterno}`}>
              <circle cx="230" cy="230" r="200" />
            </svg>

            {/* Pacote parado na posição inicial, sobre o nó do topo. */}
            <span aria-hidden="true" className={styles.pacote} />

            <div className={styles.foto}>
              <Retrato forma="circulo" alt={`Portrait of ${nomeCompleto}`} />
            </div>

            {NOS.map((no) => (
              <span key={no.lado} aria-hidden="true" className={`${styles.no} ${styles[no.lado]}`} />
            ))}
            {NOS.map((no) => (
              <span
                key={no.lado}
                aria-hidden="true"
                className={`t-meta ${styles.rotulo} ${styles[`rotulo-${no.lado}`]}`}
              >
                {no.rotulo}
              </span>
            ))}
          </div>

          <figcaption id="orbita-legenda" className={`t-meta ${styles.legenda}`}>
            {hero.legendaOrbita}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
