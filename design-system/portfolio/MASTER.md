# Design system — Rota (v2)

Fonte de verdade visual do portfólio. Os valores vivem em `app/tokens.css`; este arquivo explica o que cada um significa, como o movimento se comporta e o que é proibido. Mudou um token? Atualize os dois juntos.

Origem: esboço aprovado pelo autor em 2026-11-19 (`docs/redesign/esboco/`) e ADR 0012, que substitui a direção Graphite (v1, no histórico do git com a tag `v1-graphite`). Comportamento seção por seção: `docs/redesign/home.md`.

## Princípios

- **Uma requisição atravessando camadas.** A órbita do hero, a rota com a esfera e as camadas da Stack contam a mesma história: de redes a software. Nenhum elemento decorativo entra sem servir a essa ideia.
- **O âmbar é sinal, não decoração.** Marca onde o visitante está e o que fazer agora (ver "Uso do acento").
- **Estático primeiro.** Todo conteúdo existe no HTML na forma final; movimento é camada por cima e pode ser desligado sem perder nada.
- **Um momento orquestrado.** O carregamento do hero (nome digitado, depois as stacks) é o único movimento que começa sozinho em primeiro plano. Seções não entram com fade ou slide ao rolar.
- **Hierarquia por tamanho, peso e largura.** A largura variável do Archivo separa display (largo), texto (normal) e metadado (estreito), sem trocar de família.

## Cor

Contraste medido contra o fundo indicado (WCAG 2.x). Texto pede 4,5:1; componentes e estados, 3:1.

| Token | Valor | Uso | Contraste |
| --- | --- | --- | --- |
| `--bg` | `#0E1621` | Fundo da página, do header e dos botões secundários | — |
| `--surface` | `#142030` | Card, tile, ficha do About, campo de formulário | — |
| `--surface-2` | `#1B2A3D` | Superfície sobre superfície, capa sem imagem, hover de tile | — |
| `--line-1` | `#1C2C3F` | Borda inferior do header, divisórias, anel tracejado | decorativa |
| `--line-2` | `#263A52` | Borda de chip, card, tile e da foto | decorativa |
| `--line-3` | `#2E4763` | Borda de botão secundário, anel da órbita, partículas | 1,90 (decorativa) |
| `--line-ui` | `#5F7896` | Borda que identifica um componente sem texto próprio: campo de formulário, controle de pausa; sublinhado de link | 3,99 bg · 3,61 surface · 3,19 surface-2 |
| `--ink` | `#E9EEF3` | Texto principal, títulos, borda dos nós | 15,57 bg · 14,06 surface |
| `--ink-2` | `#C3CDD8` | Parágrafos de apoio, chip | 11,29 bg · 9,03 surface-2 |
| `--ink-dim` | `#93A3B5` | Metadados, legendas, rótulos, caminho no header | 7,05 bg · 5,64 surface-2 |
| `--ink-mute` | `#7F91A6` | Sobrenome no hero, ligações das partículas ao cursor | 5,63 bg · 5,08 surface · 4,50 surface-2 (evitar) |
| `--accent` | `#F2A93B` | Ver "Uso do acento" | 9,10 bg · 8,22 surface |
| `--accent-hover` | `#F6BD62` | Hover do botão primário | 10,71 bg |
| `--on-accent` | `#0E1621` | Texto sobre `--accent` | 9,10 |
| `--error` | `#FF6961` | Mensagem de erro de formulário | 6,44 bg |

O apelido `--rule` (antigo nome de `--line-1`) foi removido: nenhum CSS Module o usa mais.

Os tons de linha do esboço (`#1F3045`, `#22344A`) foram consolidados em `--line-1` e `--line-2`. Componente nunca usa hex direto: só `var(--token)`. Exceções documentadas, onde o valor não pode ler variável CSS e por isso espelha o token: `app/opengraph-image.tsx` (Satori), o `themeColor` em `app/layout.tsx` (espelha `--bg`) e o ícone do site: `app/icon.svg`, `app/favicon.ico` e `app/apple-icon.png` (o `</>` da marca do header em `--accent` sobre `--bg`; o PNG e o ICO são renderizações do SVG, sem cantos arredondados no apple-icon porque o iOS arredonda sozinho). Bibliotecas que pedem cor em JavaScript (partículas) leem o token com `getComputedStyle`.

### Uso do acento

O âmbar aparece só nestes papéis:

1. Ação principal: o botão primário ("See the projects"). Um por tela.
2. Posição: sublinhado do item ativo no menu, esfera da rota e nós já alcançados.
3. Sinal em movimento: pacote da órbita, cursor de digitação, ponto do chip de status.
4. Foco e hover: anel de foco e hover de links.
5. Marca: o `</>` do header, do ícone do site e do cartão de compartilhamento (ícone `code-xml` do Lucide). É o único uso do âmbar como desenho, e vale só para a marca.

Nunca em parágrafo, título ou como preenchimento grande além do botão primário.

## Tipografia

- **Archivo**, fonte variável com eixos `wght` (100–900) e `wdth` (62–125), carregada por `next/font/google` com `axes: ['wdth']`, subset `latin`, `display: 'swap'`. Uma família só; a IBM Plex Mono sai.
- Largura (`font-variation-settings: 'wdth' N`) tem papel fixo: **118** display e títulos de seção, **112** títulos de card e marca, **100** texto, **82–86** metadado e a linha de stacks.

| Classe | Tamanho | Peso | Largura | Entrelinha · tracking | Uso |
| --- | --- | --- | --- | --- | --- |
| `.t-hero` | `clamp(min(3.5rem, (100vw − 3rem) / 6.4), 8vw, 7.25rem)` | 760 | 118 | 0,95 · −0,025em | h1 da home, exclusivo |
| `.t-titulo` | `clamp(2.5rem, 6vw, 4rem)` | 700 | 118 | 1,02 · −0,015em | h1 de página interna |
| `.t-h2` | `clamp(2.125rem, 4vw, 3rem)` | 700 | 118 | 1,05 · −0,01em | Título de seção |
| `.t-h2-grande` | `clamp(2.75rem, 5.5vw, 4.75rem)` | 700 | 118 | 1,02 · −0,015em | Título da seção Contact, exclusivo |
| `.t-h3` | `clamp(1.3125rem, 2vw, 1.5rem)` | 650 | 112 | 1,2 · 0 | Cargo, nome de projeto, título de post |
| `.t-stack` | `clamp(1.25rem, 2.2vw, 1.625rem)` | 600 | 86 | 1,3 · 0 | Linha de stacks do hero, exclusivo |
| corpo | `clamp(1.0625rem, 0.9rem + 0.4vw, 1.125rem)` | 400 | 100 | 1,6 · 0 | Texto corrido (17 → 18px) |
| `.t-pequeno` | 1rem / 0,9375rem | 400–600 | 100 | 1,5 · 0 | Menu (16px), botões, texto de card (15px) |
| `.t-meta` | 0,875rem | 400–500 | 82 | 1,4 · 0 | Datas, período, legenda, caminho no header; mínimo 13px no celular |

O mínimo do `.t-hero` encolhe em tela estreita: "Augustinho" mede 6,3em a `wdth` 118 e, a 56px, passa de 335px (celular de 375px). No hero da home o tamanho também tem teto pela coluna do texto (`Hero.module.css`, `.texto .titulo`): `min(clamp acima, 100cqw / 6,8)`, porque "Augustinho." mede cerca de 6,55em (6,67em com o cursor) e a linha não quebra. Em desktop isso dá cerca de 99px em vez de 116px e mantém 4rem (mais ou menos 80px de folga) entre o nome e a órbita. Código em MDX usa a pilha monoespaçada do sistema (`--font-mono`); nada é baixado e a fonte não aparece em rótulos. `.t-lead` (1,25rem, `--ink-2`) continua para a descrição de página interna.

A classe visual não decide a tag: o nível do heading segue a hierarquia da página. Comprimento de linha de texto corrido: até 34rem (cerca de 70 caracteres) na home e em `/sobre`; no corpo das páginas de projeto, a letra vai de 18px (celular) a 21px (a partir de uns 1100px) e a linha chega a 52rem (cerca de 80 caracteres), numa coluna de 56rem, porque ali o texto é longo, fica sozinho na coluna, e a coluna de 34rem com letra de 18px deixava mais da metade da tela vazia.

## Espaço, grade e forma

- Escala: `--space-1` 8px · `--space-2` 16px · `--space-3` 24px · `--space-4` 40px · `--space-5` 64px · `--space-6` 96px · `--space-7` 112px.
- `--content-max` 80rem; `--gutter` 2,5rem no desktop e 1,25rem abaixo de 640px.
- Espaço entre seções: `--secao` 7rem no desktop e 4,5rem no celular. Hero: 5rem em cima, 4rem embaixo.
- Raio: `--radius-xs` 3px (nós, marcadores, tile de monograma interno), `--radius-sm` 6px (chip, campo), `--radius` 8px (botão), `--radius-lg` 10px (card, tile de tecnologia, prévia), 50% só na foto.
- Bordas são permitidas em componentes (1px, tons `--line-*`). Sombra não.
- Alvo de toque: no mínimo 44 × 44 px; botões com 48px de altura.

## Movimento

Tokens: `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)` · `--dur-fast` 150ms (cor) · `--dur-base` 220ms (ímã, transform) · `--dur-line` 300ms (sublinhado, borda) · `--dur-slow` 450ms (Flip, prévia).

| Efeito | Gatilho | Parâmetros | Reduzir movimento ou pausa | Celular |
| --- | --- | --- | --- | --- |
| Nome digitado | Carregamento, uma vez | 400ms de espera, 95ms por letra | Nome completo, parado | Igual |
| Linha de stacks | Depois do nome, em loop | Trios; digita 60ms, segura 1800ms, apaga 28ms, troca em 380ms | Primeiro trio, parado | Igual |
| Cursor de digitação | Durante a digitação | Pisca 1s | Oculto | Igual |
| Órbita | Contínuo | Volta em 14s, linear; inclinação até 6° pelo mouse | Pacote parado, sem inclinação | Sem inclinação |
| Ímã | Ponteiro sobre o elemento | Até 8px; fator 0,25 (menu), 0,3 (botões), 0,2 (e-mail) | Desligado | Desligado |
| Header | Seção visível | Sublinhado âmbar e caminho `/secao` | Troca sem transição | Igual |
| Rota com esfera | Scroll | Esfera acompanha o progresso; nó alcançado fica âmbar | Esfera e nós seguem o scroll sem suavização | Igual |
| Partículas | Contínuo | Até 80 (desktop) / 30 (celular); ligação 140px; cursor 170px | Um quadro parado | Sem cursor |
| Carrossel | Arrasto, setas, teclado | Inércia; cursor "Drag" e "Open" | Sem inércia | Toque nativo |
| Prévia | Clique no card | Flip do card ao diálogo em 450ms | Abre sem animação | Igual |
| Vídeo do card | Hover ou foco | Vídeo mudo em loop no lugar da capa | Capa parada | Capa parada |

Regras:

- O movimento que começa sozinho e dura mais de 5 segundos (linha de stacks, órbita, partículas) precisa de um controle visível para pausar (WCAG 2.2.2). O controle fica no header e vale para o site inteiro.
- `prefers-reduced-motion: reduce` liga a pausa por padrão; o visitante pode reativar o movimento pelo mesmo controle.
- O cursor nativo continua visível sempre. Cursor contextual é um rótulo que acompanha o ponteiro, decorativo (`aria-hidden`), só com `pointer: fine`.

## Componentes

- **Header**: sticky, fundo `--bg`, borda inferior `--line-1`. Marca (o `</>` de 26px em `--accent` + "Arthur Augustinho" em 650/112) seguida do caminho da seção em `.t-meta`. Menu em 16px, item ativo com sublinhado de 2px em `--accent` e `aria-current="location"`. Controle de pausa à direita.
- **Botão primário**: fundo `--accent`, texto `--on-accent` 650, raio 8px, altura 48px, padding horizontal 24px, ímã.
- **Botão secundário**: fundo `--bg`, borda `--line-3`, texto `--ink` 600, mesmas medidas, ímã.
- **Chip de status**: borda `--line-2`, raio 6px, 15px, texto `--ink-2`, ponto de 8px em `--accent`.
- **Tile de tecnologia**: 112 × 88px, borda `--line-2`, raio 10px, ícone na cor da marca acima do nome em `.t-meta`. Logo do Simple Icons, imagem colorida e ícone de método usam o mesmo tile (ADR 0016). Se a cor da marca tem menos de 3:1 de contraste com `--surface-2`, o componente a clareia até chegar a 3:1; o que é cinza (preto, grafite) vira `--ink`.
- **Card de projeto**: superfície `--surface`, borda `--line-2`, raio 10px, capa 16:10, nome em `.t-h3`, resumo, papel e anos em `.t-meta`, fileira de ícones.
- **Card de experiência**: cargo em `.t-h3`, período e organização em `.t-meta`, até três pontos.
- **Ficha do About**: pares rótulo (`.t-meta`, `--ink-dim`) e valor (`--ink`), separados por `--line-1`.
- **Nó da rota**: quadrado de 18px, borda 2px `--ink` (ou `--accent` quando alcançado), fundo `--bg`, raio 3px.
- **Bloco de contato**: tile com ícone e rótulo; os que não são link (Discord) copiam para a área de transferência e confirmam com "Copied".
- **Prévia do projeto**: `<dialog>` com superfície `--surface`, borda `--line-2`, raio 10px; mídia, resumo, ícones, "The problem" e "View project" (botão primário).
- Mantidos da v1: `JanelaNavegador` e `PlaceholderCapa` (este com as cores novas). A capa sem imagem mostra o nome do projeto e uma rota parada (linha de 1px com três nós quadrados em `--line-3` e `--line-ui`, sem acento); some quando a imagem real existe.

## Acessibilidade

- Foco: `outline: 2px solid var(--accent)` com `outline-offset: 3px` em tudo que recebe foco (`:focus-visible`).
- Texto que é animado existe inteiro para leitores de tela (`sr-only`) e a cópia animada fica `aria-hidden`.
- Links dentro de texto têm sublinhado (`--line-ui`); cor não é o único sinal.
- Contraste conferido na tabela de cor; qualquer combinação nova é medida antes de entrar.

## Proibido

Estes itens quebram a direção visual e devem ser recusados mesmo que pareçam melhorar a aparência:

- Segunda família tipográfica, fonte monoespaçada para rótulos, rótulo em caixa alta com tracking largo
- `box-shadow`, glow, texto ou borda com gradiente, `backdrop-filter: blur`
- `#FFFFFF` puro em texto: use `--ink`
- Acento fora dos papéis de "Uso do acento"
- Entrada animada por seção ao rolar (fade-up, slide-in), parallax de fundo, smooth scroll sequestrado
- Cursor nativo escondido
- Qualquer movimento contínuo sem passar pelo controle de pausa
- Numeração decorativa (01 / 02 / 03) em conteúdo que não é sequência
- Emoji na interface
