import type { ReactNode } from 'react'
import styles from './Rota.module.css'

// A rota: linha vertical à esquerda das seções, com um nó por seção e a
// esfera âmbar no primeiro nó (home.md §4). Estática nesta etapa; o progresso
// pelo scroll entra na Etapa 4. É decorativa (aria-hidden): a navegação real
// é o menu do header.
export function Rota({ children }: { children: ReactNode }) {
  return (
    <div className={styles.rota}>
      <div className={styles.trilho}>
        <div aria-hidden="true" className={styles.linha} />
        <span aria-hidden="true" className={styles.esfera} />
        {children}
      </div>
    </div>
  )
}

type SecaoProps = {
  id: string
  // Rótulo curto ao lado do nó ("About", "Stack"...): o ponto onde a rota
  // passa, não um título extra.
  rotulo: string
  // O h2 da seção deve ter id={`${id}-titulo`}.
  children: ReactNode
  // Contact fecha a página: espaço também embaixo.
  ultima?: boolean
}

export function Secao({ id, rotulo, children, ultima }: SecaoProps) {
  return (
    <section
      id={id}
      // O header lê data-secao para o caminho (/about) e o item ativo do menu.
      data-secao={id}
      aria-labelledby={`${id}-titulo`}
      className={`${styles.secao} ${ultima ? styles.ultima : ''}`}
    >
      <p className={`t-meta ${styles.rotulo}`}>
        <span aria-hidden="true" className={styles.no} />
        {rotulo}
      </p>
      {children}
    </section>
  )
}
