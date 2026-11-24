# 0010. Registrar domínio próprio para o site e o envio de e-mail

- Status: Aceita (nome, registrador e host canônico definidos em 2026-11-23; o domínio ainda não foi registrado)
- Situação em 2026-11-19: o site está publicado em `https://portfolio.arthur-web.workers.dev` como preview provisório, com a indexação bloqueada. O domínio próprio, a Resend (SPF, DKIM e DMARC) e o Web Analytics ficam para a entrega final.
- Data: 2026-11-10

## Contexto
O site está num subdomínio da plataforma de hospedagem. O formulário envia pela Resend com o remetente `onboarding@resend.dev`, um domínio de testes que só entrega para o e-mail dono da conta: funciona hoje apenas porque o destinatário é o próprio autor, e não serve para produção.

A receita do Devkit exige `from` em domínio verificado (SPF/DKIM), e a revisão pré-lançamento exige domínio final com um único host canônico. Com a troca de host (0005), a URL atual mudaria de qualquer forma.

## Alternativas consideradas
### A. Ficar no subdomínio da plataforma (`*.workers.dev`)
- Prós: custo zero; nada a configurar.
- Contras: URL muda a cada troca de host; remetente de e-mail continua sendo de teste; menos credibilidade em currículo e LinkedIn.

### B. Domínio próprio
- Prós: URL estável e independente do host; remetente verificado na Resend; host canônico e Search Console sob controle do autor.
- Contras: custo anual; DNS para manter.

## Decisão
B. Registrar um domínio no nome do autor, verificar o domínio na Resend (SPF, DKIM e DMARC) e trocar o `CONTACT_FROM_EMAIL` para um endereço desse domínio.

**Definido em 2026-11-23:**
- **Nome:** `arthuraugustinho.dev`. Em 2026-11-23 o registro do `.dev` respondia "not found" (RDAP 404) e o DNS devolvia domínio inexistente, o que indica que está livre; só o registrador confirma no ato da compra.
- **Registrador:** Cloudflare Registrar. O site já está na Cloudflare, então o DNS, o domínio no Worker e o redirecionamento ficam no mesmo painel, sem apontar nameservers. Concentra tudo num fornecedor, o custo que este ADR já assumia.
- **Host canônico:** `arthuraugustinho.dev`, sem `www`. O `www` redireciona (301) para ele.

## Consequências
- Positivas: URL que sobrevive a trocas de host; e-mail do formulário entregue por domínio verificado; pré-requisito para a Fase 6 (Search Console, liberar a indexação).
- Negativas / custos assumidos: custo anual de registro; registros DNS a manter; domínio expirado derruba site e e-mail juntos, então a renovação automática precisa ficar ativa; o subdomínio `*.workers.dev` continua respondendo e precisa de `X-Robots-Tag: noindex` ou redirect para não competir com o domínio na busca.
- O que faria esta decisão ser revista: nenhuma condição previsível; só o nome ou o registrador poderiam mudar.

## Plano de execução

A sequência mantém a indexação bloqueada (`NEXT_PUBLIC_INDEXAVEL=false`, `robots.txt` com `Disallow: /`) até o fim. O domínio entra no ar antes de ser indexável, e abrir a indexação é o último passo.

| # | Quem | Passo |
| --- | --- | --- |
| 1 | Autor | Registrar `arthuraugustinho.dev` na Cloudflare Registrar e ligar a renovação automática. O pagamento é do autor. |
| 2 | Autor | Conferir que a zona aparece na conta, ativa. |
| 3 | Claude, com ok | Em `wrangler.jsonc`, acrescentar `routes` com `arthuraugustinho.dev` e `www.arthuraugustinho.dev` como `custom_domain: true` e republicar com `NEXT_PUBLIC_SITE_URL=https://arthuraugustinho.dev`. O mesmo se faz pelo painel (Workers e Pages, o Worker `portfolio`, Domains e Routes). |
| 4 | Autor | Redirect Rule: host `www.arthuraugustinho.dev` vai para `https://arthuraugustinho.dev` com 301, preservando caminho e query. |
| 5 | Autor | Ligar "Always Use HTTPS" nas configurações de SSL/TLS da zona. O `workers.dev` responde 200 em HTTP hoje; no domínio isso precisa ser 301 para HTTPS. |
| 6 | Claude | Conferir por comando: `https://` com 200 e sem `X-Robots-Tag`, `http://` com 301, `www` com 301, certificado, HSTS, cabeçalhos, `canonical`, `robots.txt` e sitemap com o host novo. |
| 7 | Claude, com ok | Depois de tudo conferido, `"workers_dev": false` em `wrangler.jsonc`, para o `workers.dev` parar de responder e não competir com o domínio (consequência já prevista acima). |
| 8 | Claude | Atualizar o `CLAUDE.md` (comando de publicar e endereço) e este ADR para "domínio no ar". |

Depois do domínio, na ordem: Resend (verificar o domínio com SPF, DKIM e DMARC e trocar `CONTACT_FROM_EMAIL` por um endereço do domínio), Turnstile (permitir o host `arthuraugustinho.dev` no widget), Web Analytics (o site por hostname) e, por fim, `NEXT_PUBLIC_INDEXAVEL=true` com o Search Console.

Nada no código tem o endereço escrito à mão: o sitemap, o `robots.txt`, as tags canônicas e o cartão de compartilhamento leem `NEXT_PUBLIC_SITE_URL`, e a CSP e o HSTS não dependem do host.
