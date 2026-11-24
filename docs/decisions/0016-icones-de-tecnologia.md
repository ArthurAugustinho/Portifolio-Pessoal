# 0016. Ícones de tecnologia com Simple Icons e monograma de reserva

- Status: Aceita (atualizada em 2026-11-23: ícones coloridos e logos de outros acervos)
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

## Atualização de 2026-11-23: ícones coloridos e logos de outros acervos

O autor pediu todos os ícones do site coloridos, e que os logos que faltam fossem buscados em outros repositórios. Isso muda duas regras acima: o ícone deixa de ser monocromático (a regra "Uso nominativo: monocromático") e o monograma deixa de ser a reserva para as marcas excluídas. A alternativa C, rejeitada na decisão original, passa a valer em parte, mas sem pacote: os logos são copiados para o repositório.

**O que muda**
- **Cor:** o Simple Icons traz a cor da marca de cada logo (campo `hex`), e o componente a aplica. Cor da marca com menos de 3:1 de contraste com o fundo mais claro (`--surface-2`, WCAG 1.4.11) não é usada como está: o que é cinza (Next.js, Angular, Express, Tailscale, GitHub) vira `--ink`, e a cor com matiz (C++, Django, Insomnia, Trello, Terraform, CSS3, Bootstrap, Vite) é clareada em passos até chegar a 3:1. A conta está em `corVisivel`, em `components/ui/IconeTecnologia.tsx`.
- **Imagem (`tipo: 'imagem'`):** para as marcas que o Simple Icons não tem, um SVG colorido copiado para `public/imagens/tecnologias/`. Nada é carregado de terceiros no site; o CSP não muda.
- **Lucide (`tipo: 'lucide'`):** os nove métodos (Clean Architecture, Gitflow, Scrum, Kanban, MVP, Prototyping, Conventional Commits, ADRs e CI/CD) não são marcas e não têm logo: usam ícones do Lucide, que o projeto já tem, em cores de apoio escolhidas à mão (o do Conventional Commits é a cor da marca dele no Simple Icons).
- **Monograma:** continua no tipo `Icone` como reserva, sem uso hoje.

**Origem dos arquivos copiados** (todos com licença que permite o uso e a cópia):

| Arquivo | Origem | Licença |
| --- | --- | --- |
| `java.svg` | SVG Logos (gilbarbara), `logos:java` | CC0 |
| `aws-ecs-fargate.svg` | SVG Logos, `logos:aws-fargate` | CC0 |
| `vscode.svg` | SVG Logos, `logos:visual-studio-code` | CC0 |
| `linkedin.svg` | SVG Logos, `logos:linkedin-icon` | CC0 |
| `sql-server.svg` | Devicon, `devicon:microsoftsqlserver` | MIT |
| `zabbix.svg` | theSVG Color, `thesvg-color:zabbix` | MIT |

Os seis foram baixados pela API do Iconify. O `logos:zabbix` é o logotipo horizontal (a palavra), que não cabe num tile quadrado; por isso o Zabbix usa o símbolo (o quadrado vermelho com o Z).

**Atenção (marcas):** Oracle (Java), Amazon (AWS) e Microsoft (SQL Server, VS Code, LinkedIn) pediram a exclusão de seus logos do Simple Icons, e é por isso que eles faltavam. As licenças acima cobrem o arquivo do desenho, não a marca: o uso continua sendo nominativo (indicar que o autor trabalha com a tecnologia), sem alterar o desenho e sem sugerir parceria ou aprovação. Se algum dos donos pedir a retirada, o caminho é voltar ao monograma, que o tipo `Icone` ainda aceita.

**Consequências**
- Positivas: logos reconhecíveis para 100% das tecnologias; sem dependência nova; a conta de contraste garante que nenhum ícone some no fundo escuro.
- Negativas / custos assumidos: a Stack deixa de ser monocromática e ganha cor própria de cada marca, e o MASTER dizia que o âmbar era o único acento; as cores das marcas são dado, não token. Os seis logos copiados não se atualizam sozinhos.
