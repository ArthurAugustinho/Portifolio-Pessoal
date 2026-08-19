import Image from 'next/image'
import { JanelaNavegador } from '@/components/ui/JanelaNavegador'
import type { ProjetoCaptura } from '@/lib/projetos'
import styles from './Galeria.module.css'

type GaleriaProps = {
  capturas: ProjetoCaptura[]
}

export function Galeria({ capturas }: GaleriaProps) {
  if (capturas.length === 0) {
    return null
  }

  return (
    <div className={styles.galeria}>
      {capturas.map((captura) => (
        <figure key={captura.src} className={styles.item}>
          <JanelaNavegador moldura={captura.moldura}>
            <Image
              src={captura.src}
              alt={captura.legenda}
              width={960}
              height={540}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={styles.imagem}
            />
          </JanelaNavegador>
          <figcaption className="t-label">{captura.legenda}</figcaption>
        </figure>
      ))}
    </div>
  )
}
