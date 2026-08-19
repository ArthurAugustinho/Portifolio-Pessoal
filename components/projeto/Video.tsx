'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import styles from './Video.module.css'

function subscribe(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function getSnapshot() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// conservador: sem autoplay até confirmarmos a preferência no cliente
function getServerSnapshot() {
  return false
}

type VideoProps = {
  src: string
  poster: string
}

export function Video({ src, poster }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const autoplayPermitido = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [reproduzindo, setReproduzindo] = useState(false)

  function reproduzir() {
    videoRef.current?.play()
    setReproduzindo(true)
  }

  return (
    <div className={styles.wrapper}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        autoPlay={autoplayPermitido}
        controls={reproduzindo && !autoplayPermitido}
        className={styles.video}
      />

      {!autoplayPermitido && !reproduzindo && (
        <button
          type="button"
          onClick={reproduzir}
          className={styles.botao}
          aria-label="Reproduzir vídeo"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  )
}
