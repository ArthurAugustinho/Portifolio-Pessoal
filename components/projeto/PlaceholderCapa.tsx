import styles from './PlaceholderCapa.module.css'

type PlaceholderCapaProps = {
  nome: string
  arredondamento?: 'topo' | 'completo'
}

export function PlaceholderCapa({ nome, arredondamento = 'completo' }: PlaceholderCapaProps) {
  return (
    <div
      className={`${styles.placeholder} ${arredondamento === 'topo' ? styles.topo : styles.completo}`}
      aria-hidden="true"
    >
      <span className={`t-label ${styles.texto}`}>{nome}</span>
    </div>
  )
}
