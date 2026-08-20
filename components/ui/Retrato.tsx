import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { PlaceholderCapa } from '@/components/projeto/PlaceholderCapa'
import styles from './Retrato.module.css'

const EXTENSOES_RETRATO = ['jpg', 'jpeg', 'png', 'webp']

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
}

export function Retrato({ alt }: RetratoProps) {
  const caminho = resolverRetrato()

  if (!caminho) {
    return <PlaceholderCapa nome="TODO: foto" proporcao="4/5" />
  }

  return (
    <Image
      src={caminho}
      alt={alt}
      width={800}
      height={1000}
      sizes="(min-width: 900px) 40vw, 100vw"
      priority={false}
      className={styles.retrato}
    />
  )
}
