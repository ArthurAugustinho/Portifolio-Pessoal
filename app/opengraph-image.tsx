import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// ImageResponse (Satori) não lê variáveis CSS — os valores abaixo
// espelham --bg, --ink e --ink-dim de tokens.css. Atualize os dois
// juntos se a paleta mudar.
const BG = '#0b0b0d'
const INK = '#f5f5f7'
const INK_DIM = '#86868b'

export default async function Image() {
  const interSemiBold = await readFile(path.join(process.cwd(), 'app/Inter-SemiBold.woff'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: BG,
          padding: '96px',
        }}
      >
        <div
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 72,
            letterSpacing: '-0.035em',
            color: INK,
          }}
        >
          Arthur Augustinho
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 28,
            color: INK_DIM,
          }}
        >
          TODO: subtítulo do portfólio
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          weight: 600,
          style: 'normal',
        },
      ],
    },
  )
}
