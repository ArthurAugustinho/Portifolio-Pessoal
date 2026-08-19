import Image from 'next/image'
import Link from 'next/link'
import type { Projeto } from '@/lib/projetos'
import { PlaceholderCapa } from './PlaceholderCapa'
import styles from './ProjetoCard.module.css'

type ProjetoCardProps = {
  projeto: Projeto
}

export function ProjetoCard({ projeto }: ProjetoCardProps) {
  return (
    <article className={styles.card}>
      {projeto.capa ? (
        <Image
          src={projeto.capa}
          alt={`Captura de tela do projeto ${projeto.nome}`}
          width={640}
          height={360}
          sizes="(min-width: 640px) 50vw, 100vw"
          className={styles.capa}
        />
      ) : (
        <PlaceholderCapa nome={projeto.nome} arredondamento="topo" />
      )}

      <div className={styles.corpo}>
        <h3 className={`t-h3 ${styles.nome}`}>
          <Link href={`/projetos/${projeto.slug}`} className={styles.link}>
            {projeto.nome}
          </Link>
        </h3>

        <p className={`t-dim ${styles.resumo}`}>{projeto.resumo}</p>

        <p className={`t-label ${styles.meta}`}>
          {projeto.ano} · {projeto.stack.join(' · ')}
        </p>
      </div>
    </article>
  )
}
