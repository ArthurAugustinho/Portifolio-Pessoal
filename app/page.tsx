import { Hero } from '@/components/home/Hero'
import { Rota } from '@/components/home/Rota'
import { Blog, Contato, Experiencia, Projetos, Sobre, Stack } from '@/components/home/Secoes'

// Home em seções (ADR 0018). Estática: todo o conteúdo está no HTML na forma
// final; o movimento vem em etapa própria (ADR 0012).
export default function Home() {
  return (
    <>
      <Hero />
      <Rota>
        <Sobre />
        <Stack />
        <Experiencia />
        <Projetos />
        <Blog />
        <Contato />
      </Rota>
    </>
  )
}
