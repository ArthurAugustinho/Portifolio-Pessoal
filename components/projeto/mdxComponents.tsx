import type { MDXComponents } from 'mdx/types'
import { ehPendente } from '@/lib/projetos'
import styles from './mdxComponents.module.css'

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className={`t-h2 ${styles.h2}`} {...props} />,
  h3: (props) => <h3 className={`t-h3 ${styles.h3}`} {...props} />,
  // Parágrafo que começa com "TODO:" é aviso para o autor: não vai à página.
  p: ({ children, ...props }) => {
    const primeiro = Array.isArray(children) ? children[0] : children
    if (typeof primeiro === 'string' && ehPendente(primeiro)) return null
    return (
      <p className={styles.p} {...props}>
        {children}
      </p>
    )
  },
  ul: (props) => <ul className={styles.lista} {...props} />,
  ol: (props) => <ol className={styles.lista} {...props} />,
  a: (props) => <a {...props} />,
  // tabIndex: bloco rolável precisa ser alcançável pelo teclado.
  pre: (props) => <pre className={styles.pre} tabIndex={0} {...props} />,
  code: (props) => <code className={styles.code} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
}
