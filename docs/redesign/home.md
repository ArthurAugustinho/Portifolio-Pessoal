# Redesign v2 — especificação da home e do comportamento global

Precedência quando algo conflitar: ADRs (`docs/decisions/`) > `design-system/portfolio/MASTER.md` > este documento > esboço (`docs/redesign/esboco/`). O esboço é referência de valores e de aparência; não copie a estrutura dele (estilos inline, a classe `DCLogic`, o canvas de partículas).

Os textos em inglês abaixo são os aprovados no esboço. Não reescreva copy sem pedir; o que falta está em "Lacunas de conteúdo" e vira `TODO:`.

## 1. Estrutura da página

```
<header>  marca + caminho da seção · menu · controle de pausa
<canvas>  partículas (fixo, atrás de tudo, aria-hidden)
<main>
  #top        hero (h1)
  [rota: linha vertical à esquerda das seções abaixo, com um nó por seção]
  #about      h2 "From network operations to software."
  #stack      h2 "What I work with, layer by layer."
  #experience h2 "Where I have worked."
  #projects   h2 "Projects I have built."
  #blog       h2 "Posts from LinkedIn."           (só existe se houver posts)
  #contact    h2 "Open to full-time roles in Europe."
<footer>  © 2026 Arthur Augustinho · Privacy
<dialog>  prévia do projeto (fora do fluxo, aberto sob demanda)
```

Um `h1` (o nome). Cada seção é `<section aria-labelledby>` com o seu `h2`. Cada seção começa com o rótulo curto da seção ("About", "Stack"...) ao lado do nó da rota; esse rótulo é o ponto onde a rota passa, não um título extra.

Fontes de dados:

- `content/perfil.ts` (novo, tipado): textos do About, ficha, cargos, contatos e a ordem das camadas da Stack. Usado pela home e por `/sobre`. Antes de criar, leia `app/sobre/` e reconcilie com o que já existe lá: se os dois divergirem, pergunte qual vale.
- `lib/tecnologias.ts` (novo, ADR 0016): registro das tecnologias e ícones.
- `content/projetos/*.mdx` (existente): projetos. `content/posts/*.mdx` (novo, ADR 0017): posts.

## 2. Comportamento global

### Header
- Sticky no topo de todas as páginas. Marca: `</>` em âmbar (26px) + "Arthur Augustinho" (link para `/`), seguido do caminho da seção visível (`/about`, `/stack`...; no topo da home, vazio). O caminho é `aria-hidden` e não altera a URL.
- Menu: About, Stack, Experience, Projects, Blog (só com posts), Contact. Na home são âncoras (`#about`); nas páginas internas, `/#about`.
- Seção ativa detectada com `IntersectionObserver` (já existe uma versão em `components/layout/Header.tsx`; reaproveite a lógica, não o visual): a seção cujo topo passou de 45% da altura da janela. O item ativo ganha `aria-current="location"` e o sublinhado âmbar, que desliza entre itens (300ms).
- Ímã de 0,25 nos itens do menu (só `pointer: fine`, sem pausa).
- Link "Skip to content" continua o primeiro item focável.
- Abaixo de 640px: o menu vira um botão "Open menu" (como no esboço do celular) que abre a lista (`<button aria-expanded>`); a marca encurta para "A. Augustinho" se não couber.

### Controle de pausa
- Botão no header, à direita do menu: ícone pausa/play do Lucide, `aria-pressed`, rótulo acessível "Pause animations" / "Play animations", borda `--line-ui`.
- Estado global (contexto React leve ou atributo `data-movimento="pausado"` no `<html>`), lido por todas as animações. Persistido em `localStorage` (`movimento`), com `try/catch`: se falhar, o estado só vale para a visita.
- Padrão: pausado quando `prefers-reduced-motion: reduce`; o visitante pode reativar.
- Pausado significa: digitação mostra o estado final, órbita e partículas param, ímã e inclinação desligam, vídeo de hover não toca, Flip abre sem animação. Scroll da rota continua (é resposta direta ao scroll), sem suavização.
- O script que aplica o estado salvo roda antes da hidratação (script inline curto no `layout`, coberto pelo `'unsafe-inline'` da CSP 0008) para não piscar movimento ao carregar.
- Atualizar `/privacy`: o site guarda essa preferência no navegador, sem cookie, e nada sai do aparelho.

### Fundo de partículas
ADR 0015. Em todas as páginas, fixo, atrás do conteúdo. Inicia depois do primeiro paint útil; para com a aba oculta e com a pausa. Ligações ao cursor só com `pointer: fine`.

### Cursor contextual
Sobre a faixa do carrossel: rótulo "Drag" seguindo o ponteiro; sobre um card: "Open". Círculo de 76px com borda `--ink`, texto em `.t-meta`. `aria-hidden`, só `pointer: fine`, desligado com pausa. O cursor nativo continua visível.

### Footer
"© 2026 Arthur Augustinho" e link "Privacy" (`/privacy`). O ano vem do build, não fixo no código.

## 3. Hero (`#top`)

Conteúdo, nesta ordem:

1. Chip de status: "Open to full-time roles in Europe" (ponto âmbar).
2. `h1`: "Arthur" / "Augustinho." em duas linhas; a segunda linha em `--ink-mute`.
3. Linha de stacks (`.t-stack`), trios nesta ordem: Java / Spring Boot / PostgreSQL · Next.js / React / TypeScript · Node.js / Express / Docker · Python / Django / Flask · Angular / AWS / Terraform.
4. Descrição: "Full-stack engineer who started in network operations. I build web applications end to end and design for latency and failure from the start."
5. Botões: "See the projects" (primário, `#projects`), "GitHub" e "LinkedIn" (secundários, links externos). Ímã 0,3.
6. Órbita (ADR 0014): foto 276px (`object-position: 50% 30%`) no centro; anel de 200px de raio e anel tracejado de 156px; nós Browser (topo), Network edge (direita), API (base), Database (esquerda); pacote âmbar no anel externo. Legenda (`figcaption`): "A request travelling through the layers I work in."

Estado estático (HTML exportado): nome completo, primeiro trio de stacks, órbita parada.

Acessibilidade do texto animado:
- O `h1` contém o nome completo num `<span class="sr-only">`; a cópia que é digitada fica `aria-hidden`. O mesmo para a linha de stacks: lista completa das 15 tecnologias em `sr-only`, texto digitado `aria-hidden`.
- Nada é anunciado a cada letra (sem `aria-live` na digitação).

Digitação (ADR 0013, TextPlugin ou timeline equivalente): nome uma vez (espera de 400ms, 95ms por letra), pausa de 600ms, depois a linha de stacks em loop (digita 60ms, segura 1800ms, apaga 28ms, troca em 380ms). O cursor de digitação some quando a digitação para (pausa ou fim do nome antes do loop começar).

LCP: o nome é o maior elemento de texto da primeira tela. A digitação não pode atrasar o LCP em relação à Etapa 2 (sem animação). Meça antes e depois. Se piorar, a ordem de ajustes é: começar a digitação sem a espera de 400ms; reduzir para 60ms por letra; digitar só "Augustinho." com "Arthur" já visível.

Celular (abaixo de 640px): coluna única; órbita depois dos botões, com cerca de 300px de largura e foto proporcional; sem inclinação; rótulos dos nós podem reduzir para 13px.

## 4. Rota

Linha vertical à esquerda das seções About → Contact (gutter de 64px no desktop, 28px no celular), com um nó (MASTER, "Nó da rota") alinhado ao rótulo de cada seção.

- Estático: linha em `--line-2`, nós com borda `--ink`, esfera no primeiro nó.
- Com scroll (ScrollTrigger, `scrub`): a esfera âmbar desce acompanhando o progresso da rota; o trecho já percorrido da linha fica em `--accent`; cada nó alcançado troca a borda para `--accent`.
- O progresso é decorativo (`aria-hidden`); a navegação real é o menu.

## 5. About (`#about`)

- Texto (três parágrafos, aprovados no esboço):
  - "I build web applications end to end: APIs in Java with Spring Boot or in Node.js, interfaces in Next.js and React, data in PostgreSQL."
  - "Before writing software full-time I spent sixteen months as a network analyst at Telgo Telecom, monitoring infrastructure with Zabbix and Grafana and handling critical incidents for business clients. That is where I learned to ask where a system fails before asking how it looks."
  - "I studied Software Engineering at UniEVANGÉLICA and I am now based in Europe."
- Ficha (`<dl>`): Building software since — 2022 · Network operations — 16 months, Telgo Telecom · Degree — Software Engineering, UniEVANGÉLICA · Based in — Europe, open to relocation · Looking for — Full-time roles, remote or on-site.
- Link "Read the full story" para `/sobre` (ADR 0018).
- Desktop: texto à esquerda (até 34rem), ficha à direita. Celular: ficha abaixo do texto.

## 6. Stack (`#stack`)

- Subtítulo: "Tools and methods from my projects, my GitHub and my work at Telgo and at the university software factory."
- Uma linha por camada: nome da camada (`h3`, 10rem de largura no desktop) e a grade de tiles (`<ul>`). Camadas e itens, nesta ordem:
  - Interface: Next.js, React, TypeScript, Angular, JavaScript, HTML5, CSS3, Bootstrap
  - API: Java, Spring Boot, Spring Security, Node.js, Express, Django, Flask, Python, C++
  - Data: PostgreSQL, Flyway, SQL Server, Drizzle ORM, MySQL
  - Infrastructure: Docker, AWS ECS Fargate, Cloudflare, Zabbix, Grafana, Terraform, Linux, Jenkins, GitHub Actions
  - Testing: JUnit and Mockito, Selenium, Cypress, Pytest, Postman, Insomnia
  - Tools: Git, GitHub, VS Code, Figma, Trello, Maven, npm
  - Methods: Clean Architecture, Gitflow, Scrum, Kanban, MVP, Prototyping, Conventional Commits, ADRs, CI/CD
- Ícones pelo registro (ADR 0016). Métodos não são marcas: usam ícones do Lucide em cores de apoio (ADR 0016, atualização de 2026-11-23).
- Sem animação nesta seção.
- Celular: nome da camada acima da grade; tiles em duas ou três colunas.

## 7. Experience (`#experience`)

Lista ordenada (`<ol>`), mais recente primeiro:

| Cargo | Período | Organização | Pontos |
| --- | --- | --- | --- |
| Freelance developer | 2025–now | Independent | Web applications for clients, from landing pages to a full e-commerce platform. · Alexo: online store with Mercado Pago payments, Melhor Envio shipping and an order management panel, built solo. |
| Network analyst | 2024–2025 | Telgo Telecom | Monitored corporate network infrastructure with Zabbix and Grafana. · Configured switches and routers. · Handled critical incidents for business clients. |
| Full-stack developer | 2022–2024 | Fábrica de Tecnologias Turing, UniEVANGÉLICA | Worked on three systems: Psychology, Dentistry and Campus Security. · Built APIs in Node.js, Django and Spring Boot, with PostgreSQL and SQL Server. · Implemented authentication and access control. |

Cards em coluna única no celular; no desktop, como no esboço.

## 8. Projects (`#projects`)

- Subtítulo: "Drag or use the arrows to browse. Open a card for a short preview."
- Setas anterior/próximo (`aria-label` "Previous project" / "Next project"), desabilitadas nas pontas.
- Faixa: contêiner com rolagem horizontal nativa (`overflow-x: auto`), lista `<ul>` de cards. Toque e trackpad funcionam pela rolagem nativa; teclado: Tab percorre os cards, ← → quando o foco está na faixa movem um card. `scroll-snap` só com `pointer: coarse`.
- Arrasto com mouse (Etapa 4): GSAP Draggable com `type: 'scrollLeft'` e InertiaPlugin sobre o mesmo contêiner, para não perder a rolagem nativa. Carregados por import dinâmico na primeira interação.
- Card: link para `/projetos/[slug]`, para funcionar sem JavaScript. Com JavaScript, o clique simples (botão principal, sem Ctrl, Cmd ou Shift) abre a prévia em vez de navegar; o link recebe `aria-haspopup="dialog"`. Capa 16:10 (`next/image`; sem capa, `PlaceholderCapa`), nome, resumo, fileira de ícones (`role="img"` com `aria-label` "Built with Java, Spring Boot…"), papel e anos.
- Vídeo no hover/foco (Etapa 4): se o projeto tiver `video`, o vídeo mudo em loop substitui a capa enquanto o ponteiro ou o foco estiver no card; `preload="none"`, carrega só no primeiro hover; nunca com pausa ativa ou `Save-Data`.
- Ordem: `ordenarProjetos` (existente).
- Prévia (ADR 0018): `<dialog>` com mídia, nome (título do diálogo), resumo, ícones com nomes, "The problem" (texto curto vindo do frontmatter, campo novo `problema`), papel e anos, botão primário "View project" para `/projetos/[slug]` e botão "Close". Esc e clique fora fecham; o foco volta ao card. Etapa 4 adiciona o Flip do card até o diálogo (450ms).
- Projetos novos em MDX: `alexo.mdx` (papel "Built solo"), `segue-me.mdx` e `jade.mdx`. O schema exige `ano` (número), `stack` (ids do registro), `papel` e `periodo`, e esses campos não aceitam `TODO:`. Peça os dados ao autor no início da Etapa 3; projeto sem eles não ganha arquivo e fica fora do carrossel até chegarem. Textos (corpo, `problema`) podem ter `TODO:`. Resumos aprovados:
  - Pass+: "Appointment scheduling for clinics, with patients, doctors, receptionists and admins working from the same data." (Backend and field research, team of four · 2022–2025)
  - Alexo: "Online store for sportswear and football shirts, with payments, shipping and order management."
  - Segue-Me: "Web app for the animation team of the Segue-Me encounter."
  - JADE: "Personal AI assistant built on Claude."
- Mudanças no schema (`lib/projetos.ts`): `stack` validado contra os `id`s de `lib/tecnologias.ts`; campo `problema` (string curta, obrigatório). Migrar `pass-mais.mdx`.

## 9. Blog (`#blog`)

ADR 0017. Subtítulo: "What I am building, learning and reading." Link "See all posts" (ímã 0,3) para `/blog`. Três cards: imagem (opcional), data e tempo de leitura em `.t-meta`, título, resumo, "Read on LinkedIn" (sublinhado `--line-ui`), link externo para o post. Sem posts, a seção não existe.

## 10. Contact (`#contact`)

- Título `.t-h2-grande` centralizado: "Open to full-time roles in Europe."
- Texto: "Based in Europe and open to relocation. Write to me about a role or a project."
- Botão que copia o e-mail (ímã 0,2), mostrando o endereço e um ícone de cópia; confirmação "Copied" em região `aria-live="polite"`. Sem a API de área de transferência, o botão vira link `mailto:`.
- Link para o formulário: "Use the contact form" → `/contato`.
- Blocos (`<nav aria-label="Profiles">`): GitHub, LinkedIn, Instagram, Gmail, Discord. Instagram e Discord ficam ocultos enquanto o campo estiver vazio em `content/perfil.ts`. Discord não tem link público por nome de usuário: o bloco copia o usuário.

## 11. Páginas internas

`/sobre`, `/projetos`, `/projetos/[slug]`, `/contato`, `/privacy`, `/blog`, 404: mesmo header, mesmo fundo de partículas e mesmos tokens; sem órbita e sem rota. Layout próprio de cada uma é adaptado na Etapa 6, sem redesenhar a estrutura que já existe.

## 12. Desempenho

Metas na home, medidas no build de produção (`npm run build` + servidor estático, ou o preview do Worker), Lighthouse mobile e desktop:

- Performance ≥ 90 (mobile) e ≥ 95 (desktop); Accessibility = 100; Best Practices ≥ 95; SEO ≥ 95.
- LCP ≤ 2,5s, CLS ≤ 0,05, TBT ≤ 200ms (mobile simulado).
- JavaScript: a Etapa 2 mede a linha de base da home (gzip). O redesign pode somar no máximo 80 KB gzip ao JavaScript carregado na abertura da home. Draggable, InertiaPlugin, Flip e as partículas carregam depois (interação ou ocioso) e são reportados à parte.
- Fonte: um arquivo variável do Archivo (subset latin); conferir o tamanho e usar `preload` só nele.
- Imagens: retrato e capas em WebP/AVIF com `width`/`height`; vídeos com `preload="none"`.

Cada etapa reporta: Lighthouse mobile da home (as quatro notas), LCP, TBT, CLS e o JS gzip da home comparado com a etapa anterior.

## 13. Lacunas de conteúdo

Nunca inventar; usar `TODO:` e listar ao final da etapa.

- `[YEAR]`, `[ROLE]` e `[STACK]` de Alexo, Segue-Me e JADE; texto "The problem" de cada projeto.
- Capas e vídeos curtos dos projetos (só Pass+ tem mídia hoje, confirmar).
- Posts do LinkedIn: título, data, resumo, texto completo, link e imagem de cada um.
- @ do Instagram e usuário do Discord.
- Itens não identificados do README do GitHub ("COCÔ", com ícone de caixas empilhadas, e "Microsoft"): confirmar com o autor antes de colocar na Stack.
- Texto de "Read the full story" e de `/sobre` revisado em inglês pelo autor (ADR 0011).
