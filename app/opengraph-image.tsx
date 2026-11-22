import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { perfil } from '@/content/perfil'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
// Exigido pelo export estático (output: 'export').
export const dynamic = 'force-static'

// ImageResponse (Satori) não lê variáveis CSS — os valores abaixo
// espelham --bg, --ink, --ink-2, --ink-mute, --ink-dim, --line-2 e --accent
// de tokens.css. Atualize os dois juntos se a paleta mudar.
const BG = '#0e1621'
const INK = '#e9eef3'
const INK_2 = '#c3cdd8'
const INK_MUTE = '#7f91a6'
const INK_DIM = '#93a3b5'
const LINE_2 = '#263a52'
const ACCENT = '#f2a93b'

// O cartão repete o hero: a marca do header, o nome em duas linhas (sobrenome
// em --ink-mute), o cargo e o chip de status com o ponto âmbar. A fonte é a
// Inter porque o Satori só lê TTF, OTF e WOFF, e o Archivo do site é WOFF2.
export default async function Image() {
  const interBold = await readFile(path.join(process.cwd(), 'app/Inter-Bold.woff'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          padding: '80px 96px',
          fontFamily: 'Inter',
          fontWeight: 700,
        }}
      >
        {/* Marca: o quadrado do header, ampliado. */}
        <div
          style={{
            width: 44,
            height: 44,
            border: `5px solid ${INK}`,
            borderRadius: 8,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: INK,
            }}
          >
            {perfil.nome.primeiro}
          </div>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: INK_MUTE,
            }}
          >
            {`${perfil.nome.sobrenome}.`}
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: INK_DIM }}>Full-stack developer</div>
        </div>

        {/* Chip de status, como o do hero. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 16,
            padding: '12px 24px',
            border: `2px solid ${LINE_2}`,
            borderRadius: 8,
            fontSize: 28,
            color: INK_2,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: ACCENT }} />
          {perfil.status}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  )
}
