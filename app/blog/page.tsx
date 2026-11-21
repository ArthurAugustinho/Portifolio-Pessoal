import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/home/PostCard'
import { getPosts } from '@/lib/posts'
import { metadataDaPagina } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = metadataDaPagina({
  titulo: 'Blog',
  descricao: 'Posts by Arthur Augustinho from LinkedIn: what I am building, learning and reading.',
  caminho: '/blog',
})

// Sem posts, a página não existe (ADR 0017). Em desenvolvimento isso é um 404;
// no export, o notFound() ainda gera um blog.html, que
// scripts/corrigir-prefetch.mjs remove do out/ quando não há posts.
export default function BlogPage() {
  const posts = getPosts()

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Blog</h1>
      <ul className={styles.posts}>
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
