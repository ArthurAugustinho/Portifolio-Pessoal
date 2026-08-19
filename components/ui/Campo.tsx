import { forwardRef } from 'react'
import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react'
import styles from './Campo.module.css'

type CampoTextoProps = {
  honeypot?: false
  label: string
  erro?: string
  as?: 'input'
} & InputHTMLAttributes<HTMLInputElement>

type CampoTextareaProps = {
  honeypot?: false
  label: string
  erro?: string
  as: 'textarea'
} & TextareaHTMLAttributes<HTMLTextAreaElement>

type CampoHoneypotProps = {
  honeypot: true
} & InputHTMLAttributes<HTMLInputElement>

type CampoProps = CampoTextoProps | CampoTextareaProps | CampoHoneypotProps

export const Campo = forwardRef<HTMLInputElement | HTMLTextAreaElement, CampoProps>(
  function Campo(props, ref) {
    if (props.honeypot) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluído do spread abaixo, não é atributo HTML válido
      const { honeypot: _honeypot, ...resto } = props
      return (
        <input
          {...resto}
          ref={ref as Ref<HTMLInputElement>}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
        />
      )
    }

    const { label, erro, as = 'input', ...resto } = props
    const erroId = erro ? `${resto.name}-erro` : undefined

    if (as === 'textarea') {
      const campoProps = resto as TextareaHTMLAttributes<HTMLTextAreaElement>
      return (
        <div className={styles.campo}>
          <label htmlFor={resto.name} className="t-label">
            {label}
          </label>
          <textarea
            {...campoProps}
            id={resto.name}
            ref={ref as Ref<HTMLTextAreaElement>}
            className={styles.controle}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erroId}
          />
          {erro && (
            <p id={erroId} role="alert" className={styles.erro}>
              {erro}
            </p>
          )}
        </div>
      )
    }

    const campoProps = resto as InputHTMLAttributes<HTMLInputElement>
    return (
      <div className={styles.campo}>
        <label htmlFor={resto.name} className="t-label">
          {label}
        </label>
        <input
          {...campoProps}
          id={resto.name}
          ref={ref as Ref<HTMLInputElement>}
          className={styles.controle}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erroId}
        />
        {erro && (
          <p id={erroId} role="alert" className={styles.erro}>
            {erro}
          </p>
        )}
      </div>
    )
  },
)
