# 0012. Identidade visual "Rota" no lugar da Graphite

- Status: Aceita
- Data: 2026-11-20

## Contexto
A identidade atual (Graphite, `design-system/portfolio/MASTER.md` até a versão 1) é escura, sóbria, com acento azul e movimento mínimo, e deixava animação para uma "fase posterior". O autor decidiu redesenhar o site e aprovou em 2026-11-19 um esboço da home (cópia em `docs/redesign/esboco/`): fundo azul-marinho, acento âmbar, Archivo com eixo de largura e movimento como parte da identidade (nome digitado, órbita no hero, esfera que percorre a linha do tempo, partículas no fundo, ímã nos botões).

A ideia que amarra o visual é a trajetória do autor: começou em operação de redes e hoje constrói aplicações. A órbita mostra uma requisição passando por Browser, Network edge, API e Database; o âmbar é o "sinal" que marca onde a requisição (e o visitante) está.

O público e o tempo de visita não mudam: recrutadores e tech leads na Irlanda e no Reino Unido, menos de dois minutos no site.

## Alternativas consideradas
### A. Manter a Graphite e só adicionar movimento
- Prós: menos trabalho; nenhum CSS Module precisa mudar de cor ou tipografia.
- Contras: o cinza neutro com acento azul não carrega a ideia da rota; o autor já aprovou outra direção.

### B. Direção "Rota", como no esboço aprovado
- Prós: identidade própria, ligada à história do autor; o esboço já resolveu hierarquia, cores e comportamento.
- Contras: todos os estilos mudam; uma identidade apoiada em movimento cria risco de desempenho e de acessibilidade, que precisa de regra explícita (0013 a 0015 e o MASTER v2).

### C. Graphite com acento âmbar
- Prós: troca barata.
- Contras: não é nenhuma das duas; o azul-marinho e a tipografia larga são metade da identidade aprovada.

## Decisão
B. Os valores e as proibições estão no `MASTER.md` v2; os comportamentos, em `docs/redesign/home.md`.

Regra estrutural que vale para todo o redesign: **o estado final estático vem primeiro e o movimento é uma camada por cima**. O HTML exportado já contém todo o conteúdo na forma final (nome completo, lista completa de tecnologias, todos os projetos). Sem JavaScript, com "reduzir movimento" ou com a pausa global ativada, a página fica completa e parada. Nenhum texto depende de animação para aparecer.

## Consequências
- Positivas: identidade distinta; uma família tipográfica só (Archivo variável, eixos `wght` e `wdth`), o que tira a IBM Plex Mono do payload; a regra do estado estático deixa leitores de tela, buscadores e "reduzir movimento" corretos desde o início.
- Negativas / custos assumidos: todos os CSS Modules e `app/tokens.css` mudam; bordas em componentes passam a ser permitidas (o esboço usa), revogando a regra "sem borda em card" da Graphite; o acento aparece em mais lugares, com regra de uso própria; o MASTER v1 fica só no histórico do git (tag `v1-graphite`).
- O que faria esta decisão ser revista: Lighthouse mobile abaixo de 90 sem solução dentro das ADRs 0013 a 0015; dados de visita mostrando abandono na home; retorno de recrutadores de que o movimento atrapalha a leitura.
