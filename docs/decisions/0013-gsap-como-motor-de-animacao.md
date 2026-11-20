# 0013. GSAP como motor único de animação

- Status: Aceita
- Data: 2026-11-20

## Contexto
O esboço aprovado (0012) pede: o nome digitado letra por letra uma vez; a linha de stacks digitada em loop, três por vez; ímã de até 8 px em botões e links; sublinhado e caminho (`/about`, `/stack`...) no header acompanhando a seção; uma esfera que desce a linha do tempo conforme o scroll e acende os nós alcançados; carrossel arrastável com inércia; card que se expande até a prévia do projeto. O `CLAUDE.md` proibia biblioteca de animação até esta fase.

## Alternativas consideradas
### A. CSS e JavaScript próprios
- Prós: nenhuma dependência.
- Contras: animação ligada ao scroll em CSS (`animation-timeline`) não tem suporte em todos os navegadores que o público usa, então precisaria de um fallback em JS; arrasto com inércia, ímã e a transição card → prévia viram código próprio para escrever, testar e manter.

### B. GSAP com `@gsap/react`
- Prós: um motor para sequência (timeline), scroll (ScrollTrigger), digitação (TextPlugin), arrasto com inércia (Draggable e InertiaPlugin) e transição de layout (Flip); anima fora do ciclo de renderização do React, sem re-render por quadro; `gsap.matchMedia()` concentra "reduzir movimento" e ponteiro fino num lugar só; `useGSAP` faz a limpeza ao desmontar; a biblioteca e os plugins são gratuitos (verificado em novembro de 2026), e há skills oficiais para o Claude Code.
- Contras: dependência de algumas dezenas de KB; API imperativa dentro de componentes React; a licença padrão proíbe uso em ferramentas que concorram com o construtor visual da Webflow (não se aplica a este site).

### C. Motion (antigo Framer Motion)
- Prós: API declarativa e idiomática em React; animação de layout forte.
- Contras: o cursor contextual faz parte do pacote pago (Motion+); a transição até um `<dialog>` na camada superior é mais difícil com animação de layout; anima por estado do React.

## Decisão
B, com estas regras:

- Só os plugins usados: ScrollTrigger, TextPlugin, Draggable, InertiaPlugin e Flip, registrados uma vez num módulo próprio.
- Draggable, InertiaPlugin e Flip entram por import dinâmico na primeira interação com o carrossel (ponteiro sobre a faixa ou foco num card), fora do JavaScript inicial da home.
- Toda animação é criada dentro de `gsap.matchMedia()`, com as condições `reduceMotion` e `finePointer`, e obedece à pausa global (`docs/redesign/home.md`, "Controle de pausa").
- CSS continua cuidando do que é simples (hover, foco, troca de cor). GSAP só entra onde há sequência, scroll ou física.

## Consequências
- Positivas: um modelo mental para todo o movimento; "reduzir movimento" e pausa tratados em um lugar.
- Negativas / custos assumidos: dependências novas `gsap` e `@gsap/react`; nenhuma outra biblioteca de animação entra (Motion, anime.js, Lottie, AOS, Lenis e smooth scroll em geral ficam proibidos); o peso de cada etapa precisa ser medido (orçamento em `docs/redesign/home.md`).
- O que faria esta decisão ser revista: mudança de licença do GSAP; animação ligada ao scroll em CSS com suporte amplo, o que permitiria trocar o ScrollTrigger por CSS.
