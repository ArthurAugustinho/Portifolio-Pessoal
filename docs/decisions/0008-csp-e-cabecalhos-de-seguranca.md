# 0008. CSP com 'unsafe-inline' em script e cabeçalhos de segurança via _headers

- Status: Aceita (atualizada em 2026-11-24: sem o Turnstile, pela 0019)
- Data: 2026-11-10

## Contexto
A revisão pré-lançamento do Devkit pede Content-Security-Policy, Strict-Transport-Security, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e proteção contra framing. Com o export estático (0005):

- `headers` do `next.config` não funciona, então os cabeçalhos vão no arquivo `_headers` servido pela Cloudflare;
- não há servidor para gerar nonce por requisição;
- o Next.js injeta scripts inline para a hidratação.

O site carrega um terceiro: o Cloudflare Web Analytics (0009). O Turnstile (0007) saiu com o formulário (0019).

## Alternativas consideradas
### A. CSP estrita com nonce
- Prós: a proteção mais forte contra XSS.
- Contras: exige servidor gerando nonce a cada requisição, incompatível com o export estático.

### B. CSP com hashes gerados no build
- Prós: dispensa `'unsafe-inline'` em scripts.
- Contras: um script pós-build precisa calcular o hash de cada script inline e escrever regras por rota no `_headers`; quebra silenciosamente quando o Next.js muda o que injeta; mais código para manter.

### C. CSP com `'unsafe-inline'` em `script-src` e as demais diretivas restritivas
- Prós: simples; mantém bloqueio de origens não listadas, de framing, de plugins e de `<base>`.
- Contras: não impede a execução de script inline injetado.

### D. Só os cabeçalhos, sem CSP
- Prós: o mais simples.
- Contras: reprova o item de CSP da revisão; nenhum controle sobre origens de script.

## Decisão
C. Política inicial, a ajustar na implementação conferindo o console do navegador:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

O risco de `'unsafe-inline'` foi aceito porque o site não renderiza conteúdo de usuário, e o MDX só vem do próprio repositório (0003).

## Consequências
- Positivas: bloqueia script de origem não autorizada, clickjacking, plugins e sequestro de `<base>`; o item de CSP da revisão é atendido.
- Negativas / custos assumidos: `'unsafe-inline'` não protege contra XSS por injeção de script inline; toda nova origem de terceiro exige editar o `_headers`; CSP errada quebra recursos sem aviso visível, então o console precisa ser conferido em cada preview; o `preload` do HSTS fica para depois do domínio definitivo (0010).
- O que faria esta decisão ser revista: o site passar a exibir conteúdo de usuário ou de terceiros; o Next.js passar a gerar CSP com hashes no export estático; ou o site deixar de ser estático.
