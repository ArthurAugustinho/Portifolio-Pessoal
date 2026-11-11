# 0005. Hospedagem na Cloudflare com export estático do Next.js

- Status: Aceita
- Data: 2026-11-10

## Contexto
O site está na Vercel, plano Hobby. Os termos da Vercel restringem o Hobby a uso pessoal e não comercial, e consideram comercial qualquer ganho financeiro de quem participa do projeto. Um portfólio que se declara aberto a freelance fica, no mínimo, em zona cinzenta. A hospedagem precisa ser gratuita.

O site é estático, exceto pelo formulário de contato. A ficha da Cloudflare no Devkit registra que o plano Free não restringe uso a projetos pessoais.

## Alternativas consideradas
### A. Continuar na Vercel Hobby
- Prós: nenhuma migração; integração nativa com Next.js.
- Contras: uso comercial fora dos termos do plano.

### B. Vercel Pro
- Prós: sem ambiguidade nos termos; nenhuma migração.
- Contras: custo fixo mensal (US$ 20 por usuário) para um site pequeno.

### C. Netlify Free
- Prós: plano gratuito permite projeto comercial; roda Next.js com servidor.
- Contras: migração do mesmo jeito; segundo a ficha no Devkit, estourar o limite de créditos pode pausar todos os projetos da conta.

### D. Cloudflare Workers com OpenNext (Next.js completo)
- Prós: mantém route handlers e otimização de imagem.
- Contras: no plano gratuito, Worker limitado a 3 MiB comprimidos e a 10 ms de CPU por requisição. Risco real de estourar com Next.js 16.

### E. VM na Oracle Cloud Always Free
- Prós: controle total; laboratório de Docker, proxy reverso e TLS.
- Contras: patches, firewall e backup ficam por conta do autor; a Oracle pode recuperar instâncias Always Free ociosas, e um site estático é ocioso por natureza; falta de capacidade na região é comum.

### F. Cloudflare com export estático (`output: 'export'`)
- Prós: gratuito, sem restrição de uso comercial; HTML servido como asset estático pela rede da Cloudflare; `_headers` e `_redirects` nativos; anti-spam (Turnstile) e analytics no mesmo provedor.
- Contras: perde os recursos do Next.js que exigem servidor (ver Consequências).

## Decisão
F. `next build` com `output: 'export'` gera a pasta `out/`, publicada como static assets de um Worker. O código do Worker só executa para a rota do formulário (0007); o restante é arquivo estático. A configuração exata do roteamento entre assets e Worker é verificada na implementação.

Pesaram três critérios: custo zero com uso comercial permitido, nenhum servidor para manter e o menor número de peças móveis.

## Consequências
- Positivas: hospedagem gratuita e dentro dos termos; site servido de CDN; o HTML gerado é portátil para qualquer host estático.
- Negativas / custos assumidos:
  - Sem otimização de imagem em runtime: `images.unoptimized: true`, e as imagens entram no repositório já otimizadas (WebP/AVIF, dimensões certas).
  - Sem route handlers que leem `Request`, sem `proxy` e sem `headers`/`redirects`/`rewrites` do `next.config`. O formulário vira Worker (0007), os cabeçalhos vão para `_headers` (0008) e os redirects para `_redirects` (0004).
  - Dois passos de publicação: `next build` e `wrangler deploy`.
  - Acoplamento moderado: o HTML é portátil, mas o Worker usa a API da Cloudflare.
  - O deploy de preview por branch, exigido pelo Devkit, precisa ser configurado na Cloudflare ou na CI.
  - Depois da migração, o projeto na Vercel precisa ser desativado para não deixar conteúdo duplicado no ar.
- O que faria esta decisão ser revista: necessidade de renderização no servidor ou de conteúdo dinâmico; mudança nos termos do plano gratuito da Cloudflare.
