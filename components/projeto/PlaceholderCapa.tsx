import styles from './PlaceholderCapa.module.css'

type PlaceholderCapaProps = {
  nome: string
  arredondamento?: 'topo' | 'completo'
  proporcao?: '16/9' | '16/10' | '4/5'
}

export function PlaceholderCapa({
  nome,
  arredondamento = 'completo',
  proporcao = '16/9',
}: PlaceholderCapaProps) {
  const classeProporcao =
    proporcao === '4/5'
      ? styles.proporcao45
      : proporcao === '16/10'
        ? styles.proporcao1610
        : styles.proporcao169
  const classeArredondamento = arredondamento === 'topo' ? styles.topo : styles.completo

  return (
    <div
      className={`${styles.placeholder} ${classeProporcao} ${classeArredondamento}`}
      aria-hidden="true"
    >
      <span className={`t-meta ${styles.texto}`}>{nome}</span>
      {/* A rota do site (linha e nós quadrados), parada: marca que a imagem
          ainda não chegou sem inventar uma. Sem movimento, então não passa
          pelo controle de pausa. */}
      <span className={styles.rota}>
        <span className={styles.no} />
        <span className={styles.no} />
        <span className={styles.no} />
      </span>
    </div>
  )
}
