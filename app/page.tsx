import { Hero } from '@/components/home/Hero'
import { RevelaLateral } from '@/components/home/RevelaLateral'
import { Rota } from '@/components/home/Rota'
import { Blog, Contato, Experiencia, Projetos, Sobre, Stack } from '@/components/home/Secoes'
import { blocosDeContato, perfil } from '@/content/perfil'
import { SITE_URL } from '@/lib/site'

// Dados estruturados (schema.org/Person): ligam o site ao nome e aos perfis
// públicos. Só o que já está na página; nada de e-mail ou foto. Os perfis vêm
// dos mesmos blocos da seção Contact (só os que são links https), então o
// Instagram entra quando for preenchido em content/perfil.ts.
const PESSOA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: `${perfil.nome.primeiro} ${perfil.nome.sobrenome}`,
  jobTitle: 'Full-stack developer',
  description: 'Full-stack developer based in Europe.',
  url: SITE_URL,
  // O Discord fica de fora: o link de perfil só abre para quem está logado.
  sameAs: blocosDeContato()
    .filter((bloco) => bloco.id !== 'discord')
    .map((bloco) => bloco.href)
    .filter((href): href is string => Boolean(href?.startsWith('https://'))),
}

// Home em seções (ADR 0018). Estática: todo o conteúdo está no HTML na forma
// final; o movimento vem em etapa própria (ADR 0012).
export default function Home() {
  return (
    <>
      {/* "<" escapado: o JSON nunca fecha a tag <script> por engano. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PESSOA).replace(/</g, '\\u003c') }}
      />
      <RevelaLateral />
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
