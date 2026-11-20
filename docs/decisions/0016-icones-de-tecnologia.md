# 0016. Ícones de tecnologia com Simple Icons e monograma de reserva

- Status: Aceita
- Data: 2026-11-20

## Contexto
O redesign mostra tecnologias como ícones em quatro lugares: as camadas da seção Stack, os cards do carrossel, a prévia do projeto e os blocos de contato. O esboço usa monogramas (Jv, Sb, Pg...) para não redesenhar marcas.

O Lucide, já usado no projeto, é para ícones de interface e não mantém ícones de marca. O Simple Icons (dados SVG em domínio público, CC0) cobre a maioria das marcas, mas deixa de fora as empresas que pediram exclusão; a lista do próprio projeto inclui Amazon/AWS, Microsoft (inclusive LinkedIn, C# e Visual Studio) e Oracle (inclusive Java). Na stack do autor isso afeta pelo menos Java, AWS ECS Fargate e o LinkedIn dos contatos, e provavelmente SQL Server e VS Code. A lista final sai da versão instalada.

## Alternativas consideradas
### A. Simple Icons e monograma para o que faltar
- Prós: logos reconhecíveis à primeira vista, que é o que um recrutador procura; um pacote só, com import por ícone; ícones monocromáticos em `currentColor` seguem a paleta.
- Contras: mistura de logo e monograma na mesma grade.

### B. Só monogramas, como no esboço
- Prós: consistência total; nenhuma dependência; nenhuma questão de marca.
- Contras: reconhecimento mais lento; o visitante precisa ler cada tile.

### C. Devicon (MIT), que cobre Java, AWS e Microsoft
- Prós: cobertura maior.
- Contras: estilos variados entre ícones e versões coloridas; mais um pacote; as marcas continuam sendo dos donos do mesmo jeito.

## Decisão
A, com estas regras:

- Registro único em `lib/tecnologias.ts`: `id`, nome, camada da seção Stack e `icone`, que é `{ tipo: 'simple-icons', slug }` ou `{ tipo: 'monograma', texto }`.
- Import nomeado por ícone (`import { siReact } from 'simple-icons'`), nunca o pacote inteiro.
- O componente `IconeTecnologia` é um Server Component: o SVG sai pronto no HTML exportado e não soma JavaScript no cliente. Ícone sempre `aria-hidden`, com o nome da tecnologia como texto visível ou `sr-only`.
- Logo e monograma usam o mesmo tile (tamanho, borda, raio, cor), para a mistura não parecer quebrada.
- Uso nominativo: monocromático, sem alterar o desenho, sem sugerir parceria.
- O frontmatter dos projetos passa a validar `stack` contra os `id`s do registro (Zod), e o card, a prévia e a página do projeto leem o mesmo registro.

## Consequências
- Positivas: uma fonte de verdade para nome, camada e ícone; erro de digitação no MDX derruba o build com o nome do arquivo.
- Negativas / custos assumidos: dependência `simple-icons`; o `stack` do `pass-mais.mdx` precisa migrar para os `id`s do registro; as marcas excluídas aparecem como monograma.
- O que faria esta decisão ser revista: se a mistura de logo e monograma ficar visualmente inconsistente na revisão da etapa, adotar B.
