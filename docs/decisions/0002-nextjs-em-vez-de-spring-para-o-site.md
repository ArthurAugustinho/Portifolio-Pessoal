# 0002. Next.js para o site do portfólio, em vez de Spring Boot

- Status: Aceita
- Data: 2026-08-19 (decisão anterior ao primeiro commit; registrada retroativamente em 2026-11-11)

## Contexto
A ideia inicial do portfólio era uma arquitetura API-first que demonstrasse proficiência de ponta a ponta, com Java/Spring Boot, a stack principal do autor. Com o objetivo do site definido como "mostrar com clareza os projetos já construídos", e não "demonstrar variedade de tecnologias", o site passou a ser essencialmente conteúdo estático com um formulário de contato.

Registro retroativo: o contexto vem das anotações do projeto.

TODO: registrar se chegou a existir implementação em Spring Boot ou só o planejamento, e qual frontend estava previsto.

## Alternativas consideradas
### A. API em Spring Boot com frontend separado (API-first)
- Prós: o próprio site exibiria a stack principal (Java/Spring); arquitetura em camadas visível no código.
- Contras: dois deploys e um servidor sempre ligado para servir conteúdo que não muda; custo e operação desproporcionais; o recrutador vê os projetos, não a arquitetura do portfólio.

### B. Next.js (App Router) gerando páginas estáticas
- Prós: uma base de código; páginas pré-renderizadas no build; ecossistema React que o autor já domina; componentes reaproveitáveis em outros projetos.
- Contras: o site em si não demonstra Java; Next.js traz mais JavaScript no cliente do que o conteúdo exige.

### C. Astro
- Não avaliada na época. TODO: confirmar. O Devkit indica Astro como opção padrão para site de conteúdo com pouca interatividade, por enviar zero JavaScript por padrão. A interatividade atual (faixa de seção, vídeo e formulário) caberia em ilhas.

## Decisão
B. Next.js. O critério foi usar a ferramenta proporcional ao problema: o conteúdo é estático e a demonstração de Java/Spring fica nos projetos documentados (por exemplo, o Pass+), não na infraestrutura do portfólio.

## Consequências
- Positivas: uma base de código; deploy simples; a migração para export estático (0005) cabe sem reescrita.
- Negativas / custos assumidos: mais JavaScript no cliente do que um site de conteúdo precisaria; dependência do ritmo de mudanças do Next.js (a versão 16 trouxe APIs que diferem do material de referência comum).
- O que faria esta decisão ser revista: o site deixar de precisar de componentes React interativos (Astro passa a ser mais adequado), ou surgir a necessidade de um backend real, que entraria como serviço separado, por exemplo uma API em Spring.
