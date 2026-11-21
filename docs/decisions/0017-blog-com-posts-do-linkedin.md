# 0017. Blog com os posts do LinkedIn em MDX no repositório

- Status: Aceita
- Data: 2026-11-20

## Contexto
O autor quer uma área de blog com as postagens que já faz no LinkedIn. Pontos que limitam a solução:

- a leitura automática de posts de um perfil pessoal pela API do LinkedIn, em geral, não é liberada; confirmar antes de descartar de vez;
- o embed oficial do LinkedIn é um `<iframe>` de terceiro: exige `frame-src` na CSP (0008), carrega scripts e cookies do LinkedIn e obriga a atualizar a política de privacidade;
- copiar posts por scraping viola os termos do LinkedIn;
- o site é somente em inglês (0011), e alguns posts podem estar em português.

## Alternativas consideradas
### A. Um arquivo MDX por post, com link para o original
- Prós: mesmo modelo dos projetos (0001, 0003), validado no build; nenhum terceiro carregado; o texto fica no domínio do autor.
- Contras: publicação manual, uns minutos por post; sem curtidas nem comentários.

### B. Embed do LinkedIn
- Prós: o post aparece como no LinkedIn, com reações.
- Contras: terceiro com cookies em todas as visitas à home; CSP e privacidade mudam; o visual do embed não segue o site; um embed por card pesa.

### C. Importação automática (API ou scraping)
- Prós: nada manual.
- Contras: a API provavelmente não está disponível para o caso; scraping viola os termos.

## Decisão
A. Detalhes:

- Arquivos em `content/posts/*.mdx`, lidos por `lib/posts.ts` com schema Zod estrito: `slug` (igual ao nome do arquivo), `titulo`, `data` (ISO), `resumo`, `linkedin` (URL https em `linkedin.com`), `idioma` (`'en'` ou `'pt-BR'`), `imagem` opcional `{ src, alt }`.
- O corpo do MDX é o texto completo do post: o tempo de leitura é calculado no build a partir dele, e ele permite uma página própria por post no futuro.
- A home mostra os três posts mais recentes; `/blog` lista todos. Cada card leva ao post original ("Read on LinkedIn").
- Sem posts, a seção da home, o item "Blog" do menu e a página `/blog` não são gerados. Nunca placeholder.
- Imagens são baixadas para `public/blog/`; nada de hotlink de `media.licdn.com` (a CSP só permite `img-src 'self'`).
- Post com `idioma: 'pt-BR'` recebe `lang="pt-BR"` no card; o público lê inglês, então o ideal são posts em inglês.
- A mesma regra de `TODO:` dos projetos vale para os posts quando `NEXT_PUBLIC_INDEXAVEL=true`.

## Consequências
- Positivas: nenhum cookie nem script de terceiro; o blog segue o design e o pipeline de conteúdo que já existem.
- Negativas / custos assumidos: cada post novo do LinkedIn exige um commit; o texto existe em dois lugares.
- O que faria esta decisão ser revista: API do LinkedIn disponível para o caso; volume de posts que justifique automação; decisão de publicar primeiro no site e depois no LinkedIn.
