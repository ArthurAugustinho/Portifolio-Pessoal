import { IconeTecnologia } from '@/components/ui/IconeTecnologia'
import type { ProjetoLink } from '@/lib/projetos'
import { tecnologiaPorId } from '@/lib/tecnologias'
import styles from './FichaTecnica.module.css'

type FichaTecnicaProps = {
  papel: string
  periodo: string
  // ids de lib/tecnologias.ts
  stack: string[]
  links: ProjetoLink[]
}

export function FichaTecnica({ papel, periodo, stack, links }: FichaTecnicaProps) {
  return (
    <dl className={styles.ficha}>
      <div className={styles.linha}>
        <dt className="t-meta">Role</dt>
        <dd>{papel}</dd>
      </div>

      <div className={styles.linha}>
        <dt className="t-meta">Period</dt>
        <dd>{periodo}</dd>
      </div>

      <div className={styles.linha}>
        <dt className="t-meta">Stack</dt>
        <dd>
          <ul className={styles.stack}>
            {stack.map((id) => {
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
        </dd>
      </div>

      {links.length > 0 && (
        <div className={styles.linha}>
          <dt className="t-meta">Links</dt>
          <dd className={styles.links}>
            {links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
}
