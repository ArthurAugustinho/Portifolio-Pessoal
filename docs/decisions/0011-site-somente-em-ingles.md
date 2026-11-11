# 0011. Site somente em inglês

- Status: Aceita (substitui a 0004)
- Data: 2026-11-11

## Contexto
A 0004 decidiu um site bilíngue, com inglês padrão e rotas `/en` e `/pt`. Antes de implementá-la, o autor decidiu publicar o site inteiro só em inglês. O público principal continua sendo recrutadores e tech leads na Irlanda e no Reino Unido. A indexação ainda está bloqueada (`NEXT_PUBLIC_INDEXAVEL`), então mudar a estrutura de URLs agora não custa redirects nem perda de SEO. O site continua em pt-BR no código atual.

## Alternativas consideradas
### A. Somente inglês, sem segmento de idioma na URL
- Prós: um texto por página e um MDX por projeto; as rotas atuais (`/sobre`, `/projetos`, `/contato`) são mantidas; sem `[lang]`, sem dicionários, sem seletor de idioma, sem `hreflang` e sem `_redirects` para `/`; menos superfície para erro em inglês que o autor precisa sustentar em entrevista.
- Contras: clientes de freelance no Brasil não têm versão em português; adicionar um segundo idioma depois exige reestruturar as rotas (o custo que a 0004 pagava agora).

### B. Bilíngue com `[lang]` e dicionários próprios (a 0004)
- Prós: atende os dois públicos; `hreflang` e canonical por idioma.
- Contras: todo texto novo existe em dois idiomas; dois MDX por projeto; seletor e `hreflang` feitos à mão; mais trabalho antes de o site estar publicável.

### C. Somente inglês, mas já sob `/en/...`
- Prós: o segundo idioma entra depois sem mudar as URLs existentes.
- Contras: prefixo sem função hoje; exige `[lang]` e o redirect de `/` agora, ou seja, grande parte do custo de B sem o benefício.

## Decisão
A. O site é publicado somente em inglês, com as rotas atuais e `<html lang="en">`.

Decisão do autor. O motivo registrado é o do contexto: o público principal, na Irlanda e no Reino Unido, lê em inglês. Se houver outro critério, registrar aqui.

## Consequências
- Positivas: menos conteúdo para manter e revisar; arquitetura mais simples; nenhuma dependência nova.
- Negativas / custos assumidos: sem versão em português para clientes no Brasil; todo texto em inglês, inclusive a trajetória e o Pass+, precisa ser revisado pelo autor antes de publicar; a `/` deixa de precisar de redirect e a localização passa a ser "Europe".
- O que faria esta decisão ser revista: demanda real de clientes no Brasil, ou dados de acesso mostrando visitantes que não leem inglês.
