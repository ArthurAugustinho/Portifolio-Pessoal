'use client'

import { Copy } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Contato.module.css'

// Copia `valor` e mostra "Copied" por 2 s. Sem a API de área de transferência
// (ou se ela falhar), devolve false e o chamador cai no comportamento padrão.
function useCopiar(valor: string) {
  const [copiado, setCopiado] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  async function copiar(): Promise<boolean> {
    if (!navigator.clipboard) return false
    try {
      await navigator.clipboard.writeText(valor)
    } catch {
      return false
    }
    setCopiado(true)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setCopiado(false), 2000)
    return true
  }

  return { copiado, copiar }
}

// Sem JavaScript (ou sem clipboard) é um link mailto: o HTML exportado já
// funciona. Com clipboard, o clique copia o endereço e confirma na região
// aria-live, em vez de abrir o programa de e-mail.
export function CopiarEmail({ email }: { email: string }) {
  const { copiado, copiar } = useCopiar(email)

  return (
    <div className={styles.email}>
      <a
        href={`mailto:${email}`}
        className={styles.botaoEmail}
        data-ima={0.2}
        onClick={async (evento) => {
          // O padrão é cancelado já, porque a cópia é assíncrona; se ela não
          // for possível, abre o mailto manualmente.
          if (!navigator.clipboard) return
          evento.preventDefault()
          if (!(await copiar())) window.location.href = `mailto:${email}`
        }}
      >
        <span>{email}</span>
        <span className={`t-meta ${styles.copiar}`}>
          <Copy size={16} aria-hidden="true" />
          Copy
        </span>
      </a>
      <p aria-live="polite" className={`t-meta ${styles.status}`}>
        {copiado ? 'Copied' : ''}
      </p>
    </div>
  )
}

// Bloco de contato que não tem link público (Discord): copia o usuário.
export function CopiarBloco({
  valor,
  rotulo,
  icone,
}: {
  valor: string
  rotulo: string
  icone: ReactNode
}) {
  const { copiado, copiar } = useCopiar(valor)

  return (
    <button type="button" className={styles.bloco} onClick={() => void copiar()}>
      {icone}
      <span className="t-meta">{rotulo}</span>
      <span aria-live="polite" className="sr-only">
        {copiado ? `${rotulo} username copied` : ''}
      </span>
    </button>
  )
}
