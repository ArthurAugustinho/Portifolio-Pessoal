import styles from './JanelaNavegador.module.css'

type JanelaNavegadorProps = {
  moldura?: 'navegador' | 'nenhuma'
  children: React.ReactNode
}

export function JanelaNavegador({ moldura = 'navegador', children }: JanelaNavegadorProps) {
  if (moldura === 'nenhuma') {
    return children
  }

  return (
    <div className={styles.janela}>
      <div className={styles.barra} aria-hidden="true">
        <span className={styles.circulo} />
        <span className={styles.circulo} />
        <span className={styles.circulo} />
      </div>
      <div className={styles.conteudo}>{children}</div>
    </div>
  )
}
