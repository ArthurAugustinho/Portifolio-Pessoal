// Pós-build do export estático (roda sozinho depois de `npm run build`).
//
// O Next 16 grava os arquivos de segmento em subpastas, por exemplo
// out/sobre/__next.sobre/__PAGE__.txt, mas o cliente os pede com pontos,
// /sobre/__next.sobre.__PAGE__.txt. Sem este passo cada prefetch dá 404 e
// o console de toda página fica com erros vermelhos. Copiamos cada arquivo
// para o nome com pontos, ao lado da pasta; os originais ficam intactos.
import { cpSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('out')

if (!existsSync(OUT)) {
  console.error('corrigir-prefetch: pasta out/ não encontrada (rode o build antes).')
  process.exit(1)
}

function arquivosDentro(dir, prefixo = []) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = path.join(dir, nome)
    return statSync(caminho).isDirectory()
      ? arquivosDentro(caminho, [...prefixo, nome])
      : [{ caminho, partes: [...prefixo, nome] }]
  })
}

let copiados = 0

function percorrer(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = path.join(dir, nome)
    if (!statSync(caminho).isDirectory()) continue

    if (nome.startsWith('__next.')) {
      for (const { caminho: origem, partes } of arquivosDentro(caminho)) {
        cpSync(origem, path.join(dir, [nome, ...partes].join('.')))
        copiados += 1
      }
    } else {
      percorrer(caminho)
    }
  }
}

percorrer(OUT)
console.log(`corrigir-prefetch: ${copiados} arquivo(s) de segmento copiados para o nome com pontos.`)
