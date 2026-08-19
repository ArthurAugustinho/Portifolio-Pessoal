import type { MDXComponents } from 'mdx/types'
import styles from './mdxComponents.module.css'

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className={`t-h2 ${styles.h2}`} {...props} />,
  h3: (props) => <h3 className={`t-h3 ${styles.h3}`} {...props} />,
  p: (props) => <p className={styles.p} {...props} />,
  ul: (props) => <ul className={styles.lista} {...props} />,
  ol: (props) => <ol className={styles.lista} {...props} />,
  a: (props) => <a {...props} />,
  code: (props) => <code className={styles.code} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
}
