import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Export estático (ADR 0005): o build gera out/, servido como assets do
  // Worker. Sem otimização de imagem em runtime, então as imagens entram
  // no repositório já otimizadas.
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
