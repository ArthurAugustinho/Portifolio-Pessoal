# Design system — Graphite

Fonte de verdade visual do portfólio. Os valores vivem em `app/tokens.css`; este arquivo explica o que cada um significa e o que é proibido. Mudou um token? Atualize os dois juntos.

Origem: identidade definida para o portfólio antes do Devkit. Pela regra do Playbook, a identidade existente tem prioridade sobre recomendações de skill. Comparação com a ui-ux-pro-max: pendente (ver "Pendências").

## Princípios

- Escuro, sóbrio, com um único acento. A hierarquia vem de tamanho, peso e espaço, não de cor.
- Mono marca **dado** (rótulos, stack, anos, contadores). Sans marca **narrativa**. A separação vale para o site inteiro.
- A separação entre blocos vem de mudança de superfície e de espaço, nunca de borda.

## Cor

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#0B0B0D` | Fundo da página |
| `--surface` | `#1C1C1E` | Cards, campos, blocos de código |
| `--surface-2` | `#2C2C2E` | Superfície sobre superfície |
| `--rule` | `#38383A` | Linhas divisórias (`.rule`), nunca borda de card |
| `--ink` | `#F5F5F7` | Texto principal |
| `--ink-dim` | `#86868B` | Texto secundário, rótulos |
| `--accent` | `#0A84FF` | Links e foco; no máximo três lugares por tela |
| `--accent-hover` | `#3D9DFF` | Hover de link |
| `--error` | `#FF6961` | Mensagens de erro de formulário |

Componente nunca usa hex direto: só `var(--token)`. Exceção documentada: `app/opengraph-image.tsx`, porque o gerador de imagem (Satori) não lê variáveis CSS; lá os valores espelham os tokens.

## Tipografia

- Inter, pesos 400 e 700 (só esses dois são carregados). IBM Plex Mono, peso 400.
- Carregadas por `next/font` (ver `app/fonts.ts`): hospedadas no próprio site, com `display: swap`.

| Classe | Tamanho | Peso | Uso |
| --- | --- | --- | --- |
| `.t-hero` | 52 → 84px | 700 | h1 da home, exclusivo |
| `.t-titulo` | 40 → 56px | 700 | h1 de página de conteúdo (sobre, contato, projeto) |
| `.t-h2` | 36 → 64px | 700 | Título de seção; h1 de página de listagem |
| `.t-h3` | 24 → 36px | 700 | Título de card e subseção |
| `.t-lead` | 20px | 400 | Parágrafo de abertura, em `--ink-dim`; nunca título |
| corpo | 18px | 400 | Texto corrido, entrelinha 1.6 |
| `.t-label` | 12px | 400 | Mono, caixa alta, tracking 0.12em; tudo que é dado |

Tracking negativo cresce com o tamanho (−0.02em no h3 até −0.04em no hero). A classe visual não decide a tag: o nível do heading segue a hierarquia da página (ver `ProjetoCard`, prop `nivelTitulo`).

## Espaço e forma

- Escala: `--space-1` 8px · `--space-2` 16px · `--space-3` 24px · `--space-4` 40px · `--space-5` 64px · `--space-6` 96px · `--space-7` 144px.
- Raio: `--radius` 14px ou `--radius-sm` 10px, ou zero. Nada de 4px.
- Largura máxima de conteúdo: `--content-max` 68rem.

## Movimento

- `--dur-fast` 150ms, `--dur-base` 250ms, curva `--ease` (`cubic-bezier(0.22, 1, 0.36, 1)`).
- `prefers-reduced-motion: reduce` zera animações e transições globalmente (`tokens.css`). Vídeo não faz autoplay nesse caso.

## Interação e acessibilidade

- Links em `--accent`, hover em `--accent-hover`, sem sublinhado.
- Foco: `outline: 2px solid var(--accent)` com `outline-offset: 3px` em tudo que recebe foco (`:focus-visible`).
- Contraste mínimo WCAG AA. Texto sobre placeholder de capa já foi corrigido uma vez; conferir em qualquer superfície nova.

## Proibido

Estes itens quebram a direção visual e devem ser recusados mesmo que pareçam melhorar a aparência:

- `backdrop-filter: blur` em card (glassmorphism)
- `box-shadow` colorido, borda com gradiente, texto com gradiente, glow
- `#FFFFFF` puro em texto: use `--ink`
- Borda em card
- `border-radius` de 4px
- Peso 700 ou superior fora de `.t-hero`, `.t-titulo`, `.t-h2` e `.t-h3`
- Acento em mais de três lugares na mesma tela
- Emoji na interface

## Componentes de apresentação

- `JanelaNavegador`: moldura de navegador para capturas e vídeo (`moldura: 'navegador' | 'nenhuma'`).
- `PlaceholderCapa`: substitui qualquer mídia ausente; nunca imagem quebrada.
- `FaixaStatus`: faixa fixa da home com a seção atual, em mono.

## Pendências

- Rodar a ui-ux-pro-max para comparação (decisão da reformulação). O resultado entra aqui como contraste; o Graphite continua sendo a referência até decisão em contrário.
