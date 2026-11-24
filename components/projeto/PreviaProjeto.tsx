import Image from 'next/image'
import { Botao } from '@/components/ui/Botao'
import { IconeTecnologia } from '@/components/ui/IconeTecnologia'
import { ehPendente, type Projeto } from '@/lib/projetos'
import { tecnologiaPorId } from '@/lib/tecnologias'
import { PlaceholderCapa } from './PlaceholderCapa'
import styles from './PreviaProjeto.module.css'

// Conteúdo da prévia aberta em <dialog> (ADR 0018). É renderizado no servidor
// e entregue ao Carrossel, que só decide quando mostrá-lo: o SVG dos ícones
// não precisa ir para o JavaScript do cliente.
export function PreviaProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <div className={styles.previa}>
      {projeto.capa ? (
        <Image
          src={projeto.capa}
          alt={projeto.capaAlt ?? ''}
          width={640}
          height={360}
          sizes="(min-width: 640px) 640px, 100vw"
          className={styles.capa}
        />
      ) : (
        <PlaceholderCapa nome={projeto.nome} arredondamento="topo" proporcao="16/9" />
      )}

      <div className={styles.corpo}>
        {/* Título do diálogo: o <dialog> aponta para ele com aria-labelledby. */}
        <h2 id="previa-titulo" className="t-h3">
          {projeto.nome}
        </h2>
        <p className={styles.resumo}>{projeto.resumo}</p>

        <ul className={styles.stack}>
          {projeto.stack.map((id) => {
            const tecnologia = tecnologiaPorId(id)
            if (!tecnologia) return null
            return (
              <li key={id} className={styles.tecnologia}>
                <IconeTecnologia icone={tecnologia.icone} tamanho={20} semBorda />
                <span className="t-meta">{tecnologia.nome}</span>
              </li>
            )
          })}
        </ul>

        {!ehPendente(projeto.problema) && (
          <div>
            <h3 className={`t-meta ${styles.rotulo}`}>The problem</h3>
            <p className={styles.problema}>{projeto.problema}</p>
          </div>
        )}

        <p className={`t-meta ${styles.meta}`}>
          <span>{projeto.papel}</span>
          <span>{projeto.periodo}</span>
        </p>

        <div className={styles.acoes}>
          <Botao href={`/projetos/${projeto.slug}`} variante="primario">
            View project
          </Botao>
          {/* method="dialog" fecha o <dialog> sem JavaScript próprio. */}
          <form method="dialog">
            <button type="submit" className={styles.fechar}>
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
