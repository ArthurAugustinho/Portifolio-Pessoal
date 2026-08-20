import styles from './PlaceholderCapa.module.css'

type PlaceholderCapaProps = {
  nome: string
  arredondamento?: 'topo' | 'completo'
  proporcao?: '16/9' | '4/5'
}

export function PlaceholderCapa({
  nome,
  arredondamento = 'completo',
  proporcao = '16/9',
}: PlaceholderCapaProps) {
  const classeProporcao = proporcao === '4/5' ? styles.proporcao45 : styles.proporcao169
  const classeArredondamento = arredondamento === 'topo' ? styles.topo : styles.completo

  return (
    <div
      className={`${styles.placeholder} ${classeProporcao} ${classeArredondamento}`}
      aria-hidden="true"
    >
      <span className={`t-label ${styles.texto}`}>{nome}</span>
    </div>
  )
}
