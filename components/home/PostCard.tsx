import Image from 'next/image'
import type { Post } from '@/lib/posts'
import styles from './PostCard.module.css'

const FORMATO_DATA = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// Card de post (ADR 0017): leva ao post original no LinkedIn. Post em
// português recebe lang="pt-BR" no texto, para leitor de tela e hifenização.
export function PostCard({ post }: { post: Post }) {
  const lang = post.idioma === 'pt-BR' ? 'pt-BR' : undefined

  return (
    <article className={styles.card}>
      {post.imagem && (
        <Image
          src={post.imagem.src}
          alt={post.imagem.alt}
          width={640}
          height={360}
          sizes="(min-width: 640px) 18rem, 100vw"
          className={styles.imagem}
        />
      )}

      <div className={styles.corpo}>
        <p className={`t-meta ${styles.meta}`}>
          <time dateTime={post.data}>{FORMATO_DATA.format(new Date(post.data))}</time>
          <span>{post.minutosDeLeitura} min read</span>
        </p>

        <h3 className={`t-h3 ${styles.titulo}`} lang={lang}>
          <a href={post.linkedin} className={styles.link} target="_blank" rel="noopener noreferrer">
            {post.titulo}
            <span className="sr-only"> (read on LinkedIn, opens in a new tab)</span>
          </a>
        </h3>

        <p className={styles.resumo} lang={lang}>
          {post.resumo}
        </p>

        <p aria-hidden="true" className={styles.acao}>
          Read on LinkedIn
        </p>
      </div>
    </article>
  )
}
