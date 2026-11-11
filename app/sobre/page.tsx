import type { Metadata } from 'next'
import { Trajetoria } from './Trajetoria'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Desenvolvedor full stack com passagem por infraestrutura de redes. Trajetória na Fábrica de Tecnologias Turing, na Telgo Telecom e como freelancer.',
}

export default function SobrePage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">Sobre</h1>
      <Trajetoria />
    </div>
  )
}
