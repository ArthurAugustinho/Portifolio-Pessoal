# 0003. Compilar MDX com @mdx-js/mdx diretamente

- Status: Aceita
- Data: 2026-08-19 (decisão anterior ao primeiro commit; registrada retroativamente em 2026-11-11)

## Contexto
O conteúdo vive em arquivos MDX com frontmatter em `content/projetos/` (0001). O site precisa listar, ordenar e filtrar projetos a partir do frontmatter e renderizar o corpo de cada um com componentes próprios (`mdxComponents`). A biblioteca mais usada para isso no Next.js, `next-mdx-remote`, teve o repositório arquivado.

Registro retroativo: o contexto vem das anotações do projeto.

## Alternativas consideradas
### A. next-mdx-remote
- Prós: API pronta para Server Components; muito material de referência.
- Contras: repositório arquivado, sem correções futuras; risco de incompatibilidade com React 19 e Next.js 16.

### B. @next/mdx (plugin oficial)
- Prós: mantido pela equipe do Next.js; MDX importado como componente.
- Contras: não suporta frontmatter por padrão (exige plugins remark); trata cada MDX como módulo importado, o que encaixa pior no modelo "pasta de conteúdo lida por `lib/projetos.ts`" usado para listar e ordenar projetos.

### C. @mdx-js/mdx (`compile` + `run`)
- Prós: biblioteca base do ecossistema MDX, mantida; controle total sobre compilação e componentes; frontmatter continua com `gray-matter`.
- Contras: mais código próprio (em `app/projetos/[slug]/page.tsx`); `run` executa o código compilado, equivalente a `eval`.

## Decisão
C. Compilar no build com `compile(..., { outputFormat: 'function-body' })` e executar com `run`. Pesou a manutenção ativa e o controle sobre o pipeline, sem depender de projeto arquivado.

## Consequências
- Positivas: nenhuma dependência abandonada; plugins remark/rehype podem ser adicionados quando houver necessidade.
- Negativas / custos assumidos: o MDX precisa ser conteúdo confiável, porque `run` executa código. Só arquivos do próprio repositório podem ser compilados, nunca conteúdo vindo de usuário ou de rede. Sem `remark-gfm`, tabelas e listas de tarefas no estilo GitHub não renderizam hoje.
- O que faria esta decisão ser revista: o conteúdo passar a vir de fonte externa (CMS, usuário), ou o Next.js oferecer suporte nativo a conteúdo com frontmatter que dispense o pipeline próprio.
