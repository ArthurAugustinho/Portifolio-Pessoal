# 0006. Remover o Tailwind CSS

- Status: Aceita
- Data: 2026-11-10

## Contexto
`tailwindcss` e `@tailwindcss/postcss` estão instalados, e `app/globals.css` contém apenas `@import "tailwindcss"`. Nenhum componente usa classe utilitária: todo o estilo está em CSS Modules com os tokens de `app/tokens.css`. Na prática, o Tailwind só fornece o reset (Preflight). Mesmo assim, o `CLAUDE.md` e a home anunciam Tailwind como parte da stack, ou seja, o site declara uma tecnologia que o código não usa.

## Alternativas consideradas
### A. Manter o Tailwind só como reset
- Prós: nenhum trabalho agora.
- Contras: uma dependência e um passo de PostCSS só para obter um reset; a stack declarada continua diferente da real.

### B. Migrar os componentes para Tailwind
- Prós: stack declarada passa a ser verdadeira; utilitários disponíveis.
- Contras: reescrever todos os `.module.css` sem ganho funcional; os tokens e as proibições do design system teriam de ser reimplementados na configuração do Tailwind.

### C. Remover o Tailwind e escrever um reset próprio
- Prós: uma dependência a menos; o estilo continua num só sistema (CSS Modules + tokens).
- Contras: o reset próprio precisa cobrir o que o Preflight fazia.

## Decisão
C. Remover `tailwindcss`, `@tailwindcss/postcss` e `postcss.config.mjs`; substituir o `@import` por um reset mínimo em `app/globals.css`; atualizar o `CLAUDE.md`.

## Consequências
- Positivas: stack declarada igual à real; build mais simples.
- Negativas / custos assumidos: componentes podem depender implicitamente do Preflight (margens zeradas, `box-sizing`, fonte herdada em `button` e `input`, `img` como bloco). Há risco de regressão visual, então todas as páginas precisam ser conferidas em 375px e 1440px antes e depois da troca.
- O que faria esta decisão ser revista: o volume de CSS crescer a ponto de os módulos gerarem duplicação significativa.
