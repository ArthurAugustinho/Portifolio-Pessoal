import type { Metadata } from 'next'
import { metadataDaPagina } from '@/lib/site'
import { Trajetoria } from './Trajetoria'
import styles from './page.module.css'

export const metadata: Metadata = metadataDaPagina({
  titulo: 'About',
  descricao:
    'Full-stack developer with a background in network infrastructure. Career at Fábrica de Tecnologias Turing, at Telgo Telecom and as a freelancer.',
  caminho: '/sobre',
})

export default function SobrePage() {
  return (
    <div className={styles.pagina}>
      <h1 className="t-titulo">About</h1>
      <Trajetoria />
    </div>
  )
}
