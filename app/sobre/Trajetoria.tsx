import { MapPin } from 'lucide-react'
import { Retrato } from '@/components/ui/Retrato'
import styles from './Trajetoria.module.css'

export function Trajetoria() {
  return (
    <section aria-label="Trajetória" className={styles.trajetoria}>
      <div className={styles.foto}>
        <Retrato alt="TODO: descrição da foto de Arthur Augustinho" />
      </div>

      <div className={styles.texto}>
        <h2 className="t-h2">Trajetória</h2>
        <p className="t-lead">TODO: linha de abertura da trajetória</p>

        <p>TODO: parágrafo 1 da trajetória</p>
        <p>TODO: parágrafo 2 da trajetória</p>
        <p>TODO: parágrafo 3 da trajetória</p>

        <dl className={styles.dados}>
          <dt className="t-label">Localização</dt>
          <dd className={styles.valor}>
            <MapPin size={16} className={styles.icone} aria-hidden="true" />
            TODO: localização
          </dd>

          <dt className="t-label">Formação</dt>
          <dd>TODO: formação</dd>

          <dt className="t-label">Disponibilidade</dt>
          <dd>TODO: disponibilidade</dd>
        </dl>
      </div>
    </section>
  )
}
