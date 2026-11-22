import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Export estático (ADR 0005): o build gera out/, servido como assets do
  // Worker. Sem otimização de imagem em runtime, então as imagens entram
  // no repositório já otimizadas.
  output: 'export',
  images: { unoptimized: true },
  // Um worker só na geração estática. Com vários, o build do desenvolvedor
  // (Windows, pouca memória livre) falhava com "JavaScript heap out of memory"
  // (worker com código 134). O site tem ~20 páginas, então o custo em tempo
  // é de poucos segundos; em máquina com folga de memória pode subir.
  experimental: { cpus: 1 },
}

export default nextConfig
