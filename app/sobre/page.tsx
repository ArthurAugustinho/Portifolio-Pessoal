import { Trajetoria } from './Trajetoria'
import styles from './page.module.css'

export default function SobrePage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Sobre</h1>
      <Trajetoria />
    </div>
  )
}
