'use client'

import { Pause, Play } from 'lucide-react'
import { useLayoutEffect, useSyncExternalStore } from 'react'
import {
  assinarMovimento,
  definirPausado,
  garantirEstadoDeMovimento,
  movimentoPausado,
} from '@/lib/movimento'
import styles from './ControlePausa.module.css'

// No servidor não há preferência salva: o valor real chega logo após a
// hidratação. O ícone não depende disso (o CSS lê data-movimento), então
// só aria-pressed troca depois.
export function useMovimento() {
  const pausado = useSyncExternalStore(assinarMovimento, movimentoPausado, () => false)
  return { pausado, definirPausado }
}

// Controle global de pausa (WCAG 2.2.2). Rótulo fixo: aria-pressed já diz
// o estado, e trocar o nome junto faria o leitor de tela anunciar o oposto.
export function ControlePausa() {
  const { pausado } = useMovimento()

  useLayoutEffect(() => {
    garantirEstadoDeMovimento()
  }, [])

  return (
    <button
      type="button"
      className={styles.botao}
      aria-pressed={pausado}
      aria-label="Pause animations"
      onClick={() => definirPausado(!pausado)}
    >
      <Pause size={18} aria-hidden="true" className={styles.pausa} />
      <Play size={18} aria-hidden="true" className={styles.play} />
    </button>
  )
}
