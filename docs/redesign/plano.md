# Redesign v2 — plano de implementação em etapas

Para o Claude Code. Leia este arquivo inteiro antes da Etapa 0 e volte a ele no início de cada etapa.

Documentos do redesign:

- `docs/decisions/0012` a `0018`: as decisões (identidade, GSAP, 3D em CSS, partículas, ícones, blog, home em seções).
- `design-system/portfolio/MASTER.md`: tokens, tipografia, movimento, componentes e proibições.
- `docs/redesign/home.md`: o que cada seção mostra e como se comporta, metas de desempenho e lacunas de conteúdo.
- `docs/redesign/esboco/`: o esboço aprovado, só como referência de valores (ver o README da pasta).

## Regras para todas as etapas

- O `CLAUDE.md` vale inteiro. Em especial: nunca ler ou alterar `.env`; nunca inventar conteúdo (use `TODO:`); perguntar antes de instalar pacote; só publicar com confirmação.
- Uma etapa por vez. Comece cada etapa com um plano curto (arquivos que vai criar ou alterar, pacotes que precisa). Espere confirmação só se houver pacote a instalar ou desvio do que os documentos pedem; senão, siga.
- Estático primeiro (ADR 0012): a etapa que cria uma seção entrega a seção completa e parada; o movimento vem em etapa própria.
- Antes de usar qualquer API do Next.js, consulte `node_modules/next/dist/docs/` (export estático, `next/font`, `next/dynamic`, `next/image`). A versão instalada pode diferir do que você conhece.
- Encontrou conflito entre documento e código, ou uma decisão que nenhuma ADR cobre? Pare e pergunte. Decisão nova vira ADR com a skill "Registrar decisão técnica (ADR)" do Devkit.
- Fim de cada etapa:
  1. `npm run lint && npm run typecheck && npm run build`
  2. Revisão da interface com a skill `web-design-guidelines` sobre os arquivos alterados
  3. Relatório: o que mudou (uma frase por arquivo relevante), o que ficou pendente, os `TODO:` novos e os números pedidos em `home.md` §12 a partir da Etapa 2
  4. Proposta de commit(s) no formato do `CLAUDE.md`. Commite só depois do meu ok e pare.

Skills por etapa: `frontend-design` nas Etapas 1 a 3 e 7 (dentro da direção do MASTER, que tem prioridade sobre sugestões da skill); as skills do plugin `gsap-skills` (core, react, timeline, scrolltrigger, plugins, performance) nas Etapas 4 a 6; "Revisão pré-lançamento" do Devkit na Etapa 8.

## Etapa 0 — Preparação (sem código)

1. Leia o `CLAUDE.md`, as ADRs 0001 a 0018, o MASTER, `home.md` e este plano.
2. Pergunte ao autor:
   - se as ADRs 0012 a 0018 estão aceitas; ao "sim", troque o status para `Aceita` e a data para o dia;
   - qual alternativa vale na ADR 0015 (A, tsParticles, ou B, canvas próprio);
   - se quer testes automatizados para a camada de conteúdo (`lib/projetos.ts`, `lib/posts.ts`, `lib/tecnologias.ts`). Se sim, proponha a ferramenta numa ADR curta antes de instalar.
3. Com o ok: `git tag v1-graphite` no commit atual da `main` e crie a branch `redesign/v2` a partir dele.
4. Proponha o commit dos documentos (`docs: registra o plano do redesign v2`), incluindo a atualização do `CLAUDE.md`.
5. Liste dúvidas e conflitos que encontrou entre os documentos e o código. Pare.

## Etapa 1 — Fundação visual

- `app/tokens.css` com os tokens do MASTER v2 (manter `--rule` como apelido de `--line-1`).
- `app/fonts.ts`: Archivo variável com `axes: ['wdth']`; sai Inter e IBM Plex Mono. Atualizar o `layout`.
- `app/globals.css` e as classes tipográficas do MASTER (`.t-hero`, `.t-titulo`, `.t-h2`, `.t-h2-grande`, `.t-h3`, `.t-stack`, `.t-pequeno`, `.t-meta`). `.t-label` sai: troque cada uso por `.t-meta`.
- `Header` novo, sem animação: marca, caminho da seção (só o texto, atualizado pelo observer que já existe), menu com âncoras, menu de celular, skip link.
- Controle de pausa completo: estado global, botão no header, persistência em `localStorage` com `try/catch`, script inline anti-flash no `layout`, padrão pausado com `prefers-reduced-motion`. Ainda não há animação para pausar; o estado só precisa existir e ser lido por um hook (`useMovimento`).
- `Rodape` novo.
- Páginas internas: só precisam continuar legíveis com os tokens novos.

Aceite: nenhum hex fora de `app/tokens.css` e das exceções do MASTER (`grep`); 375px sem rolagem horizontal em todas as páginas; foco visível em tudo; menu e controle de pausa operáveis só com teclado; a preferência de pausa sobrevive à troca de página e ao recarregamento.

## Etapa 2 — Home estática: dados, hero e seções de texto

- `content/perfil.ts` (home.md §1; reconciliar com `app/sobre/` antes).
- `lib/tecnologias.ts` e `components/ui/IconeTecnologia.tsx` (ADR 0016). Pedir para instalar `simple-icons`. Relatar quais tecnologias ficaram como monograma.
- Hero estático (home.md §3): nome completo com `sr-only`, primeiro trio de stacks, órbita em SVG parada com as camadas de profundidade já montadas (ADR 0014), foto.
- Rota estática (§4), About (§5), Stack (§6), Experience (§7), Contact (§10).
- `/sobre` passa a ler de `content/perfil.ts` onde houver sobreposição.

Aceite: home completa e legível com JavaScript desligado; um `h1`; leitor de tela lê o nome e as 15 tecnologias uma vez cada. **Esta etapa mede a linha de base** de desempenho e de JavaScript gzip da home (home.md §12); todas as etapas seguintes comparam com ela.

## Etapa 3 — Home estática: projetos e blog

- Schema de projetos: `stack` validado contra `lib/tecnologias.ts` e campo `problema`; migrar `pass-mais.mdx`. Provar que um `id` inválido derruba o build com o nome do arquivo, e reverter a prova.
- `alexo.mdx`, `segue-me.mdx` e `jade.mdx` com os resumos aprovados. Antes, peça ao autor ano, período, papel e stack de cada um; sem esses dados o projeto não ganha arquivo (§8). Texto que faltar vira `TODO:`.
- Carrossel nativo com setas e teclado; card como link que, com JavaScript, abre a prévia em `<dialog>` sem animação (ADR 0018, home.md §8).
- `lib/posts.ts` com o schema da ADR 0017, `/blog`, seção Blog da home e item do menu, todos condicionados a existir post. `sitemap` inclui `/blog` só quando houver posts.

Aceite: sem JavaScript, o card leva à página do projeto; com JavaScript, Enter ou clique abre o diálogo, Ctrl/Cmd+clique abre a página em outra aba, Esc e clique fora fecham, e o foco volta ao card; carrossel percorrido só com teclado; build sem posts não gera a seção, o item do menu nem `/blog`.

## Etapa 4 — Movimento do hero e da navegação

- Pedir para instalar `gsap` e `@gsap/react` (ADR 0013).
- `lib/movimento.ts`: registro dos plugins, `gsap.matchMedia()` com `reduceMotion` e `finePointer`, integração com a pausa (pausar ou matar timelines quando o estado mudar).
- Digitação do nome e loop das stacks (§3, com a regra do LCP), ímã (MASTER, catálogo), sublinhado deslizante e caminho no header, rota com ScrollTrigger (§4), pacote da órbita e inclinação pelo mouse (ADR 0014).

Aceite: com "reduzir movimento" ou pausa, a página fica idêntica à da Etapa 3; alternar a pausa no meio de uma animação não deixa nada em estado intermediário; navegar entre páginas e voltar à home cinco vezes não duplica animações (limpeza do `useGSAP`); LCP não piora em relação à Etapa 2; JS gzip dentro do orçamento.

## Etapa 5 — Carrossel interativo e prévia animada

- Draggable (`type: 'scrollLeft'`) e InertiaPlugin por import dinâmico (§8).
- Cursor contextual "Drag" / "Open" (home.md §2): removido em 2026-11-24.
- Vídeo no hover e no foco do card (§8).
- Flip do card até o `<dialog>` e de volta ao fechar.

Aceite: arrastar com mouse, rolar com trackpad e com toque, setas e teclado funcionam juntos sem um quebrar o outro; os chunks dinâmicos só aparecem na aba Network depois da primeira interação; com pausa, nada disso anima.

## Etapa 6 — Fundo de partículas

- Implementar a alternativa escolhida na Etapa 0 para a ADR 0015, com as regras comuns da ADR.
- Escolhida na Etapa 0: alternativa B (canvas 2D próprio), sem pacote novo.
- Aplicar o orçamento da ADR (Lighthouse mobile e TBT contra a Etapa 5) e relatar os números. Se estourar, reduzir a contagem e o custo por quadro e avisar o autor.

Aceite: partículas não aparecem no caminho do LCP; param com a aba oculta e com a pausa; 30 ou menos no celular.

## Etapa 7 — Páginas internas

- `/sobre`, `/projetos`, `/projetos/[slug]` (com ícones da stack e `problema`), `/contato` (formulário da 0007 com os tokens novos, campos com borda `--line-ui`), `/privacy` (acrescentar a preferência de pausa guardada no navegador e atualizar a data), `/blog`, 404.
- Sem órbita e sem rota; mesmo header e fundo.

## Etapa 8 — Revisão pré-lançamento

- Skill "Revisão pré-lançamento" do Devkit.
- Lighthouse mobile e desktop em todas as páginas; navegação completa só com teclado; uma passada com leitor de tela (NVDA ou Narrator) no hero, carrossel, prévia e controle de pausa.
- Publicar no preview do Worker só com confirmação (comando no `CLAUDE.md`) e conferir o console: nenhuma violação de CSP, nenhum 404.
- Lista final de `TODO:` e de lacunas (home.md §13).
- Propor o merge de `redesign/v2` em `main`. Não fazer o merge sem o ok do autor.
