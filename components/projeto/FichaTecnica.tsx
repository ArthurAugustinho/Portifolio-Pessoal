import type { ProjetoLink } from '@/lib/projetos'
import styles from './FichaTecnica.module.css'

type FichaTecnicaProps = {
  papel: string
  periodo: string
  stack: string[]
  links: ProjetoLink[]
}

export function FichaTecnica({ papel, periodo, stack, links }: FichaTecnicaProps) {
  return (
    <dl className={styles.grid}>
      <dt className="t-label">Papel</dt>
      <dd>{papel}</dd>

      <dt className="t-label">Período</dt>
      <dd>{periodo}</dd>

      <dt className="t-label">Stack</dt>
      <dd>{stack.join(' · ')}</dd>

      {links.length > 0 && (
        <>
          <dt className="t-label">Links</dt>
          <dd className={styles.links}>
            {links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </dd>
        </>
      )}
    </dl>
  )
}
