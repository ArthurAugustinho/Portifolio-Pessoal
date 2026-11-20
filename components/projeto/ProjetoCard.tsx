import Image from 'next/image'
import Link from 'next/link'
import { IconeTecnologia } from '@/components/ui/IconeTecnologia'
import type { Projeto } from '@/lib/projetos'
import { nomesDasTecnologias, tecnologiaPorId } from '@/lib/tecnologias'
import { PlaceholderCapa } from './PlaceholderCapa'
import styles from './ProjetoCard.module.css'

type ProjetoCardProps = {
  projeto: Projeto
  // A tag semântica depende de onde o card entra na hierarquia da
  // página — o estilo visual (t-h3) não muda com ela.
  nivelTitulo?: 'h2' | 'h3'
  // No carrossel da home, o Carrossel intercepta o clique e abre a prévia em
  // <dialog> (ADR 0018). Sem JavaScript, ou fora da home, o card é só um link
  // para a página do projeto.
  previa?: boolean
}

// Fileira de ícones: um único elemento de imagem para o leitor de tela, com a
// lista completa no rótulo; os ícones em si são decorativos.
export function FileiraDeIcones({ ids }: { ids: string[] }) {
  const nomes = nomesDasTecnologias(ids).join(', ')

  return (
    <span role="img" aria-label={`Built with ${nomes}`} className={styles.fileira}>
      {ids.map((id) => {
        const tecnologia = tecnologiaPorId(id)
        if (!tecnologia) return null
        return (
          <span key={id} aria-hidden="true" className={styles.chip}>
            <IconeTecnologia icone={tecnologia.icone} tamanho={18} semBorda />
          </span>
        )
      })}
    </span>
  )
}

export function ProjetoCard({ projeto, nivelTitulo = 'h3', previa = false }: ProjetoCardProps) {
  const Titulo = nivelTitulo

  return (
    <article className={styles.card}>
      <div className={styles.midia}>
        {projeto.capa ? (
          <Image
            src={projeto.capa}
            alt={`Screenshot of the ${projeto.nome} project`}
            width={640}
            height={400}
            sizes="(min-width: 640px) 440px, 86vw"
            className={styles.capa}
          />
        ) : (
          <PlaceholderCapa nome={projeto.nome} arredondamento="topo" proporcao="16/10" />
        )}

        {/* Vídeo curto no hover e no foco (Carrossel.tsx): substitui a capa
            enquanto o ponteiro ou o foco estiver no card. Sem src: só recebe o
            arquivo no primeiro hover, então nada baixa antes (preload none).
            Decorativo: a capa já descreve o projeto. */}
        {previa && projeto.video && (
          <video
            className={styles.video}
            data-video
            data-src={projeto.video.src}
            poster={projeto.video.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>

      <div className={styles.corpo}>
        <Titulo className={`t-h3 ${styles.nome}`}>
          <Link
            href={`/projetos/${projeto.slug}`}
            className={styles.link}
            data-previa={previa ? projeto.slug : undefined}
          >
            {projeto.nome}
          </Link>
        </Titulo>

        <p className={styles.resumo}>{projeto.resumo}</p>

        <FileiraDeIcones ids={projeto.stack} />

        <p className={`t-meta ${styles.rodape}`}>
          <span>{projeto.papel}</span>
          <span>{projeto.periodo}</span>
        </p>
      </div>
    </article>
  )
}
