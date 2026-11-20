# Portfólio — Arthur Augustinho

Portfólio pessoal. Objetivo único: mostrar com clareza os projetos já construídos, melhor do que o GitHub mostra. Público: recrutadores e tech leads (principalmente Irlanda e Reino Unido) e clientes de freelance; o visitante típico passa menos de dois minutos no site. Não é objetivo demonstrar variedade de tecnologias: menos stack é melhor.

Estado: reformulação em andamento, seguindo o Playbook do Devkit. As decisões em `docs/decisions/` valem mesmo antes de implementadas: site somente em inglês (0011, que substitui a 0004), Cloudflare com export estático (0005), formulário em Worker (0007), CSP via `_headers` (0008).

## Stack
- Next.js (App Router) · TypeScript estrito · CSS Modules com os tokens de `app/tokens.css`
- Conteúdo em MDX em `content/projetos/`, compilado com `@mdx-js/mdx` (0003) e validado com Zod em `lib/projetos.ts`
- `next/font` para tipografia · Lucide para ícones · React Hook Form + Zod no formulário · Resend para o e-mail
- Hospedagem: Cloudflare (migração da Vercel em andamento)
- Decisões e motivos: `docs/decisions/` (use a skill "Registrar decisão técnica (ADR)" do Devkit para novas)

Não adicione nada fora desta lista sem perguntar. Nunca adicione: biblioteca de componentes (shadcn, MUI, Chakra), gerenciador de estado, ORM, cliente HTTP, biblioteca de animação. Fase posterior, ainda não instalar: Motion, GSAP ScrollTrigger, React Three Fiber.

## Comandos
- Instalar: `npm ci`
- Desenvolvimento: `npm run dev`
- Antes de todo commit: `npm run lint && npm run typecheck && npm run build`
- Preview publicado: `https://portfolio.arthur-web.workers.dev` (Worker `portfolio`). Para republicar, force as variáveis de build no comando, porque o Next lê o `.env` local: `NEXT_PUBLIC_SITE_URL=https://portfolio.arthur-web.workers.dev NEXT_PUBLIC_INDEXAVEL=false npm run worker:deploy`. Só publique com confirmação do autor.

## Convenções
- Design: seguir `design-system/portfolio/MASTER.md`. Nunca hex direto em componente; use as variáveis de `app/tokens.css`.
- Mobile-first: testar em 375px antes de considerar uma seção pronta; responsivo até 1920px.
- Conteúdo de projeto só em `content/projetos/*.mdx`, nunca espalhado em componentes. O schema do frontmatter está em `lib/projetos.ts`; o nome do arquivo é o `slug`.
- Mídia ausente em `public/` cai no placeholder, nunca numa imagem quebrada. Imagens via `next/image`, com `width`/`height` explícitos, já otimizadas (WebP/AVIF) no repositório.
- Uma tarefa por vez. Não avance para a próxima sem confirmação.
- Antes de instalar qualquer pacote ou criar arquivo fora da estrutura abaixo, pergunte.
- Prefira menos componentes maiores a muitos arquivos minúsculos. Comentário só onde a decisão não é óbvia pelo código.
- Commits no formato `tipo: descrição` em português (feat, fix, style, docs, content), sem emoji. Nada de README gerado automaticamente nem badge.
- Ao terminar, liste em uma frase o que mudou e o que ficou pendente.

## Piso de qualidade
Não é opcional e não precisa ser pedido:
- `:focus-visible` visível em tudo que recebe foco
- `prefers-reduced-motion` respeitado
- `alt` descritivo em toda imagem, nunca "imagem do projeto"
- Um `h1` por página e hierarquia de headings correta
- `lang` correto no `<html>`

## Estrutura
```
app/
  layout.tsx  page.tsx  tokens.css  globals.css  fonts.ts
  sobre/  projetos/  projetos/[slug]/  contato/
components/
  ui/  layout/  projeto/
content/projetos/*.mdx
lib/            projetos.ts  schemas.ts  site.ts
public/imagens/  public/video/
worker/index.ts   wrangler.jsonc   (Worker do formulário, ADR 0007)
design-system/portfolio/MASTER.md
docs/decisions/NNNN-titulo.md
.github/workflows/
```
A estrutura muda com a reformulação (privacidade, headers, analytics); siga o ADR correspondente.

## Restrições
- Nunca ler, criar ou alterar arquivos `.env`. Variáveis novas vão para `.env.example` com valor vazio.
- Nunca invente conteúdo de projeto, depoimento, número, cliente ou dado de contato. Se faltar texto, use `TODO: [o que falta]` e avise ao final: texto de preenchimento plausível passa despercebido e vai para produção. O build falha com `TODO:` no conteúdo quando `NEXT_PUBLIC_INDEXAVEL=true`.
- MDX é executado no build: só compile arquivos do próprio repositório (0003).
- Nenhum cookie ou script de terceiro sem atualizar a CSP (0008) e a política de privacidade.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
