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
  // Imagem do corpo (por exemplo, um diagrama em SVG): usada no MDX como
  // <Figura src=".." alt=".." width={760} height={430} />. width e height
  // reservam o espaço antes de a imagem carregar; <img> simples porque o
  // export é estático e sem otimização, então next/image não ganha nada.
  // A caixa rola na horizontal em tela estreita (o diagrama tem largura mínima
  // para o texto continuar legível), e por isso recebe foco de teclado, como o pre.
  Figura: ({ src, alt, width, height }: FiguraProps) => (
    <div className={styles.figuraCaixa} tabIndex={0}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} loading="lazy" className={styles.figura} />
    </div>
  ),
}

type FiguraProps = { src: string; alt: string; width: number; height: number }
