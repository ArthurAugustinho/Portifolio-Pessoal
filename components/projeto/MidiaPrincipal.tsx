import Image from 'next/image'
import { JanelaNavegador } from '@/components/ui/JanelaNavegador'
import type { Projeto } from '@/lib/projetos'
import { PlaceholderCapa } from './PlaceholderCapa'
import { Video } from './Video'
import styles from './MidiaPrincipal.module.css'

type MidiaPrincipalProps = {
  projeto: Projeto
}

export function MidiaPrincipal({ projeto }: MidiaPrincipalProps) {
  if (projeto.video) {
    return (
      <JanelaNavegador>
        <Video src={projeto.video.src} poster={projeto.video.poster} />
      </JanelaNavegador>
    )
  }

  if (projeto.capa) {
    return (
      <JanelaNavegador>
        <Image
          src={projeto.capa}
          alt={`Captura de tela do projeto ${projeto.nome}`}
          width={1280}
          height={720}
          sizes="(min-width: 1088px) 68rem, 100vw"
          className={styles.imagem}
          priority
        />
      </JanelaNavegador>
    )
  }

  return <PlaceholderCapa nome={projeto.nome} />
}
