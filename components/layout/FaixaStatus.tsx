'use client'

import { useEffect, useState } from 'react'
import styles from './FaixaStatus.module.css'

type Secao = {
  id: string
  nome: string
}

type FaixaStatusProps = {
  secoes: Secao[]
}

export function FaixaStatus({ secoes }: FaixaStatusProps) {
  // índice 0 (primeira seção) é o único valor correto tanto no
  // servidor quanto na primeira renderização no cliente — a página
  // sempre carrega no topo. O IntersectionObserver só atualiza
  // depois do mount, fora da renderização de hidratação.
  const [indiceAtual, setIndiceAtual] = useState(0)

  useEffect(() => {
    const elementos = secoes
      .map((secao) => document.getElementById(secao.id))
      .filter((elemento): elemento is HTMLElement => elemento !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const indice = elementos.indexOf(entry.target as HTMLElement)
            if (indice !== -1) {
              setIndiceAtual(indice)
            }
          }
        }
      },
      { rootMargin: '-48px 0px -70% 0px', threshold: 0 },
    )

    for (const elemento of elementos) {
      observer.observe(elemento)
    }

    return () => observer.disconnect()
  }, [secoes])

  const secaoAtual = secoes[indiceAtual]
  const numero = String(indiceAtual + 1).padStart(2, '0')

  return (
    <div className={styles.faixa}>
      <span className="t-label">ARTHUR AUGUSTINHO</span>
      <span className={`t-label ${styles.direita}`} aria-live="polite">
        SEC {numero} · {secaoAtual.nome}
      </span>
    </div>
  )
}
