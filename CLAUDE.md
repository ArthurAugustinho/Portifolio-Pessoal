# CLAUDE.md

Contexto permanente deste repositório. Leia antes de qualquer alteração.

## O que é

Portfólio pessoal de Arthur Augustinho. Site estático, sem backend, sem banco de dados.

**Objetivo:** mostrar com clareza os projetos já construídos — melhor do que o GitHub mostra.
**Não é objetivo:** demonstrar variedade de tecnologias. Menos stack é melhor.

O visitante típico é recrutador ou tech lead e passa menos de dois minutos no site.

## Stack

Não adicione nada fora desta lista sem perguntar antes.

- Next.js (App Router) · TypeScript · Tailwind CSS
- Conteúdo em MDX no diretório `content/`
- `next/font` para tipografia · Lucide para ícones
- Deploy na Vercel

Fase posterior, ainda não instalar: Motion, GSAP ScrollTrigger, React Three Fiber.

**Nunca adicione:** biblioteca de componentes (shadcn, MUI, Chakra), gerenciador de estado, ORM, cliente HTTP, biblioteca de animação não listada acima.

## Design system

Os tokens vivem em `app/tokens.css`. Use as variáveis CSS — nunca hex direto no componente.

```
--bg #0B0B0D   --surface #1C1C1E   --surface-2 #2C2C2E   --rule #38383A
--ink #F5F5F7  --ink-dim #86868B   --accent #0A84FF
```

Tipografia: Inter (sans) e IBM Plex Mono (rótulos, stack, anos, contadores).
O mono marca **dado**. O sans marca **narrativa**. Essa separação é regra do site inteiro.

Escala e tracking estão em `tokens.css` nas classes `.t-hero`, `.t-titulo`, `.t-h2`, `.t-h3`, `.t-label`.

Semântica dos títulos:

- `.t-hero` → h1 da home, exclusivo
- `.t-titulo` → h1 de página de conteúdo (sobre, contato, projeto individual)
- `.t-h2` → título de seção dentro de uma página, e h1 de página de listagem

### Proibido

Estes itens quebram a direção visual e devem ser recusados mesmo se parecerem melhorar a aparência:

- `backdrop-filter: blur` em card (glassmorphism)
- `box-shadow` colorido, borda com gradiente, texto com gradiente, glow
- `#FFFFFF` puro em texto — use `--ink`
- Borda em card. A separação vem de mudança de superfície e espaço
- `border-radius` de 4px. Use `--radius` (14px), `--radius-sm` (10px) ou zero
- Peso de fonte 700 ou superior, exceto em `.t-hero`, `.t-h2` e `.t-h3`
- Acento em mais de três lugares na mesma tela
- Emoji na interface

## Conteúdo

Todo conteúdo vem de arquivos MDX em `content/projetos/`. Componentes leem via `lib/projetos.ts`.

**Nunca invente conteúdo de projeto.** Se faltar texto, use `TODO: [descrição do que falta]` e me avise ao final. Texto de preenchimento plausível é pior que um TODO visível, porque passa despercebido e vai para produção.

Frontmatter obrigatório: `slug`, `nome`, `resumo`, `ano`, `stack[]`, `destaque`, `papel`, `periodo`.

Opcionais: `links[]` (`label`, `url`), `capa`, `video` (`src`, `poster`),
`capturas[]` (`src`, `legenda`, `moldura?`). Caminhos de mídia que não
existem em `public/` caem no placeholder — nunca uma imagem quebrada.

## Piso de qualidade

Não é opcional e não precisa ser pedido:

- Responsivo de 375px a 1920px
- `:focus-visible` visível em tudo que recebe foco
- `prefers-reduced-motion` respeitado
- `alt` descritivo em toda imagem — nunca "imagem do projeto"
- Hierarquia de headings correta, um `h1` por página
- `lang="pt-BR"` no html
- Imagens sempre via `next/image`

## Como trabalhar

- Uma tarefa por vez. Não avance para a próxima sem eu confirmar.
- Antes de instalar qualquer pacote, pergunte.
- Antes de criar um arquivo fora da estrutura abaixo, pergunte.
- Prefira menos componentes maiores a muitos arquivos minúsculos.
- Comentário só onde a decisão não é óbvia pelo código.
- Nada de README gerado automaticamente, nada de badge, nada de emoji em commit.
- Ao terminar, liste em uma frase o que mudou e o que ficou pendente.

## Estrutura

```
app/
  layout.tsx  page.tsx  tokens.css  fonts.ts
  sobre/  projetos/  projetos/[slug]/  contato/
components/
  ui/  layout/  projeto/
content/projetos/*.mdx
lib/projetos.ts
public/imagens/  public/video/
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
