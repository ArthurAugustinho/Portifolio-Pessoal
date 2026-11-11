import type { Metadata } from 'next'
import { Trajetoria } from './Trajetoria'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Full stack developer with a background in network infrastructure. Career at Fábrica de Tecnologias Turing, at Telgo Telecom and as a freelancer.',
}

export default function SobrePage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">About</h1>
      <Trajetoria />
    </div>
  )
}
