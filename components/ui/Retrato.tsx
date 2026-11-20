import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { PlaceholderCapa } from '@/components/projeto/PlaceholderCapa'
import styles from './Retrato.module.css'

const EXTENSOES_RETRATO = ['webp', 'jpg', 'jpeg', 'png']

function resolverRetrato(): string | undefined {
  for (const extensao of EXTENSOES_RETRATO) {
    const caminho = `/imagens/retrato.${extensao}`
    if (existsSync(path.join(process.cwd(), 'public', caminho))) {
      return caminho
    }
  }
  return undefined
}

type RetratoProps = {
  alt: string
  // 'circulo' é o retrato do hero (órbita); o padrão é o retângulo de /sobre.
  forma?: 'retangulo' | 'circulo'
}

export function Retrato({ alt, forma = 'retangulo' }: RetratoProps) {
  const caminho = resolverRetrato()

  if (!caminho) {
    return <PlaceholderCapa nome="TODO: photo" proporcao="4/5" />
  }

  return (
    <Image
      src={caminho}
      alt={alt}
      width={800}
      height={1000}
      sizes={forma === 'circulo' ? '276px' : '(min-width: 900px) 40vw, 100vw'}
      priority
      className={forma === 'circulo' ? styles.circulo : styles.retrato}
    />
  )
}
