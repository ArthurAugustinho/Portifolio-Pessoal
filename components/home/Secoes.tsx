import Link from 'next/link'
import { IconeTecnologia } from '@/components/ui/IconeTecnologia'
import { Carrossel } from '@/components/projeto/Carrossel'
import { PreviaProjeto } from '@/components/projeto/PreviaProjeto'
import { ProjetoCard } from '@/components/projeto/ProjetoCard'
import { Botao } from '@/components/ui/Botao'
import { blocosDeContato, EMAIL, perfil } from '@/content/perfil'
import { getPosts } from '@/lib/posts'
import { getProjetos, ordenarProjetos } from '@/lib/projetos'
import { CAMADAS, tecnologiasDaCamada } from '@/lib/tecnologias'
import { CopiarBloco, CopiarEmail } from './Copiar'
import contato from './Contato.module.css'
import { MovimentoIma } from './Movimento'
import { PostCard } from './PostCard'
import { Secao } from './Rota'
import styles from './Secoes.module.css'

export function Sobre() {
  const { sobre } = perfil

  return (
    <Secao id="about" rotulo="About">
      <h2 id="about-titulo" className={`t-h2 ${styles.titulo}`}>
        {sobre.titulo}
      </h2>

      <div className={styles.sobre}>
        <div className={styles.textoSobre}>
          {sobre.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
          <p>
            <Link href="/sobre">{sobre.linkHistoria}</Link>
          </p>
        </div>

        <dl className={styles.ficha}>
          {sobre.ficha.map((item) => (
            <div key={item.id} className={styles.fichaLinha}>
              <dt className="t-meta">{item.rotulo}</dt>
              <dd>{item.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Secao>
  )
}

export function Stack() {
  const { stack } = perfil

  return (
    <Secao id="stack" rotulo="Stack">
      <h2 id="stack-titulo" className={`t-h2 ${styles.titulo}`}>
        {stack.titulo}
      </h2>
      <p className={styles.subtitulo}>{stack.subtitulo}</p>

      <div className={styles.camadas}>
        {stack.camadas.map((camadaId) => {
          const camada = CAMADAS.find((item) => item.id === camadaId)
          if (!camada) return null
          return (
            <div key={camada.id} className={styles.camada}>
              <h3 className={styles.nomeCamada}>{camada.nome}</h3>
              <ul className={styles.tiles}>
                {tecnologiasDaCamada(camada.id).map((tecnologia) => (
                  <li key={tecnologia.id} className={styles.tile}>
                    <IconeTecnologia icone={tecnologia.icone} />
                    <span className="t-meta">{tecnologia.nome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Secao>
  )
}

export function Experiencia() {
  const { experiencia } = perfil

  return (
    <Secao id="experience" rotulo="Experience">
      <h2 id="experience-titulo" className={`t-h2 ${styles.titulo}`}>
        {experiencia.titulo}
      </h2>

      <ol className={styles.cargos}>
        {experiencia.cargos.map((cargo) => (
          <li key={`${cargo.cargo}-${cargo.periodo}`} className={styles.cargo}>
            <div className={styles.cargoTopo}>
              <h3 className="t-h3">{cargo.cargo}</h3>
              <p className={`t-meta ${styles.periodo}`}>{cargo.periodo}</p>
            </div>
            <p className={styles.organizacao}>{cargo.organizacao}</p>
            <ul className={styles.pontos}>
              {cargo.pontos.map((ponto) => (
                <li key={ponto}>{ponto}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Secao>
  )
}

// Carrossel nativo com prévia em <dialog> (ADR 0018). Os cards e as prévias
// são renderizados aqui, no servidor; o Carrossel (cliente) só cuida de setas,
// teclado e de quando mostrar cada prévia.
export function Projetos() {
  const projetos = ordenarProjetos(getProjetos())

  if (projetos.length === 0) return null

  return (
    <Secao id="projects" rotulo="Projects">
      <Carrossel
        cabecalho={
          <>
            <h2 id="projects-titulo" className={`t-h2 ${styles.titulo}`}>
              {perfil.projetos.titulo}
            </h2>
            <p className={styles.subtituloSecao}>{perfil.projetos.subtitulo}</p>
          </>
        }
        cards={projetos.map((projeto) => (
          <li key={projeto.slug}>
            <ProjetoCard projeto={projeto} previa />
          </li>
        ))}
        previas={Object.fromEntries(
          projetos.map((projeto) => [projeto.slug, <PreviaProjeto key={projeto.slug} projeto={projeto} />]),
        )}
      />
      <p className={styles.verTodos}>
        <Link href="/projetos">View all projects</Link>
      </p>
    </Secao>
  )
}

// Sem posts, a seção não existe: nada de placeholder (ADR 0017).
export function Blog() {
  const posts = getPosts().slice(0, 3)

  if (posts.length === 0) return null

  const { blog } = perfil

  return (
    <Secao id="blog" rotulo="Blog">
      <div className={styles.cabecalhoBlog}>
        <div>
          <h2 id="blog-titulo" className={`t-h2 ${styles.titulo}`}>
            {blog.titulo}
          </h2>
          <p className={styles.subtituloSecao}>{blog.subtitulo}</p>
        </div>
        <Botao href="/blog">{blog.linkTodos}</Botao>
      </div>

      <ul className={styles.posts}>
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </Secao>
  )
}

export function Contato() {
  const { contato: dados } = perfil

  return (
    <Secao id="contact" rotulo="Contact" ultima>
      <div className={contato.contato}>
        <h2 id="contact-titulo" className={`t-h2-grande ${contato.titulo}`}>
          {dados.titulo}
        </h2>
        <p className={contato.texto}>{dados.texto}</p>

        <CopiarEmail email={EMAIL} />

        <p className={contato.formulario}>
          <Link href="/contato">{dados.linkFormulario}</Link>
        </p>

        <nav aria-label="Profiles">
          <ul className={contato.blocos}>
            {blocosDeContato().map((bloco) => (
              <li key={bloco.id}>
                {bloco.href ? (
                  <a
                    href={bloco.href}
                    className={contato.bloco}
                    {...(bloco.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    <IconeTecnologia icone={bloco.icone} tamanho={24} />
                    <span className="t-meta">{bloco.rotulo}</span>
                  </a>
                ) : (
                  <CopiarBloco
                    valor={bloco.copiar ?? ''}
                    rotulo={bloco.rotulo}
                    icone={<IconeTecnologia icone={bloco.icone} tamanho={24} />}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
        <MovimentoIma />
      </div>
    </Secao>
  )
}
