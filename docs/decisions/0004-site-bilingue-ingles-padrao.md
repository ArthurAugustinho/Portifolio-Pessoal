# 0004. Site bilíngue, com inglês como idioma padrão

- Status: Proposta (falta confirmar o esquema de URLs descrito na Decisão)
- Data: 2026-11-10

## Contexto
O público principal do portfólio passou a ser recrutadores na Irlanda e no Reino Unido, e o site existe só em pt-BR. Clientes de freelance no Brasil continuam sendo público. A indexação está bloqueada (`NEXT_PUBLIC_INDEXAVEL`), então mudar a estrutura de URLs agora não custa redirects nem perda de SEO.

Com o export estático (0005) não há `proxy` (o antigo middleware), que é onde o guia de internacionalização do Next.js detecta o idioma pelo cabeçalho `Accept-Language` e redireciona.

## Alternativas consideradas
### A. Só inglês
- Prós: um texto por página; metade da manutenção de conteúdo.
- Contras: perde clareza para clientes de freelance no Brasil.

### B. Só português (situação atual)
- Prós: nenhuma mudança estrutural.
- Contras: fraco para o público principal, que lê em inglês.

### C. Bilíngue com biblioteca (next-intl)
- Prós: detecção de idioma, formatação e roteamento prontos.
- Contras: dependência nova para 4 rotas e poucas dezenas de textos; parte dos recursos depende de servidor, incompatível com o export estático.

### D. Bilíngue com segmento `[lang]` e dicionários próprios
- Prós: padrão documentado pelo Next.js, sem dependência; funciona no export estático com `generateStaticParams`.
- Contras: troca de idioma e `hreflang` implementados à mão; sem detecção automática de idioma.

## Decisão
D, com inglês como padrão.

- Rotas sob `app/[lang]/` com `lang` em `en` | `pt`, geradas no build por `generateStaticParams`. O layout raiz passa para `app/[lang]/layout.tsx` para definir `<html lang>` por idioma.
- Textos de interface em dicionários (`en.json`, `pt.json`), com o tipo derivado do `en.json` para o TypeScript acusar chave faltando no outro idioma.
- Conteúdo dos projetos em um MDX por idioma, com o mesmo `slug` nos dois, para a troca de idioma mapear página a página.
- URLs: `/en/...` e `/pt/...`, com `/` respondendo 301 para `/en` via `_redirects` da Cloudflare. Alternativa descartada: inglês sem prefixo, que exigiria duplicar as páginas em grupos de rotas.

## Consequências
- Positivas: o site atende os dois públicos; `hreflang` e URL canônica por idioma ajudam a busca; nenhuma dependência nova.
- Negativas / custos assumidos: todo texto novo precisa existir nos dois idiomas, e cada texto em inglês precisa ser revisado pelo autor antes de publicar, porque ele precisa conseguir sustentá-lo em entrevista; não há detecção automática de idioma, só o seletor; a raiz `/` não tem conteúdo próprio; em `next dev`, `/` não redireciona, porque o `_redirects` só vale na Cloudflare.
- O que faria esta decisão ser revista: os dados de acesso mostrarem um dos idiomas sem uso relevante, ou a necessidade de um terceiro idioma.
