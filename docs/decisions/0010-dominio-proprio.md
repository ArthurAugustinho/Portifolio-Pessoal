# 0010. Registrar domínio próprio para o site e o envio de e-mail

- Status: Aceita (domínio registrado e no ar em 2026-11-24, com o redirecionamento do www e o HTTP forçado conferidos; a indexação segue bloqueada até o fim da entrega final)
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
| 1 | Autor, feito em 2026-11-24 | Registrar `arthuraugustinho.dev` na Cloudflare Registrar e ligar a renovação automática. O pagamento é do autor. |
| 2 | Autor, feito | Conferir que a zona aparece na conta, ativa. |
| 3 | Claude, feito em 2026-11-24 | Em `wrangler.jsonc`, acrescentar `routes` com `arthuraugustinho.dev` e `www.arthuraugustinho.dev` como `custom_domain: true` e republicar com `NEXT_PUBLIC_SITE_URL=https://arthuraugustinho.dev`. O mesmo se faz pelo painel (Workers e Pages, o Worker `portfolio`, Domains e Routes). |
| 4 | Autor, feito e conferido em 2026-11-24 | Redirect Rule: host `www.arthuraugustinho.dev` vai para `https://arthuraugustinho.dev` com 301, preservando caminho e query. |
| 5 | Autor, feito e conferido em 2026-11-24 | Ligar "Always Use HTTPS" nas configurações de SSL/TLS da zona. O `workers.dev` responde 200 em HTTP hoje; no domínio isso precisa ser 301 para HTTPS. |
| 6 | Claude, feito em 2026-11-24 | Conferir por comando: `https://` com 200 e sem `X-Robots-Tag`, `http://` com 301, `www` com 301, certificado, HSTS, cabeçalhos, `canonical`, `robots.txt` e sitemap com o host novo. |
| 7 | Claude, feito em 2026-11-24 (o wrangler o fez no deploy do passo 3, e a configuração agora é explícita) | Depois de tudo conferido, `"workers_dev": false` em `wrangler.jsonc`, para o `workers.dev` parar de responder e não competir com o domínio (consequência já prevista acima). |
| 8 | Claude, feito em 2026-11-24 | Atualizar o `CLAUDE.md` (comando de publicar e endereço) e este ADR para "domínio no ar". |

Depois do domínio, na ordem: Resend (verificar o domínio com SPF, DKIM e DMARC e trocar `CONTACT_FROM_EMAIL` por um endereço do domínio), Turnstile (permitir o host `arthuraugustinho.dev` no widget), Web Analytics (o site por hostname) e, por fim, `NEXT_PUBLIC_INDEXAVEL=true` com o Search Console.

Nada no código tem o endereço escrito à mão: o sitemap, o `robots.txt`, as tags canônicas e o cartão de compartilhamento leem `NEXT_PUBLIC_SITE_URL`, e a CSP e o HSTS não dependem do host.

## Situação em 2026-11-24

- **Registro:** `arthuraugustinho.dev` criado em 2026-11-24 e válido até 2027-11-24, na Cloudflare Registrar, com os nameservers da própria Cloudflare.
- **No ar:** o Worker `portfolio` responde em `https://arthuraugustinho.dev` e em `https://www.arthuraugustinho.dev` (domínios personalizados). O certificado é emitido pelo Let's Encrypt, e os cabeçalhos de segurança (HSTS, CSP, nosniff, Referrer-Policy e Permissions-Policy) estão presentes. A tag canônica, o `og:url`, o `og:image`, o sitemap e o JSON-LD já usam o host novo.
- **Indexação:** continua bloqueada (`robots.txt` com `Disallow: /`), de propósito, até o fim da entrega final.
- **`workers.dev` desligado:** o endereço antigo (`portfolio.arthur-web.workers.dev`) responde 404. O `wrangler` o desligou sozinho no deploy que ligou o domínio, porque o arquivo não dizia o contrário, e a configuração passou a ser explícita (`workers_dev` e `preview_urls` falsos).
- **Redirecionamentos (conferidos em 2026-11-24):** `https://www.arthuraugustinho.dev/qualquer/caminho?x=1` vai para `https://arthuraugustinho.dev/qualquer/caminho?x=1` (301), e `http://`, no apex e no www, vai para `https://` (301); `http://www` chega ao apex em dois saltos. A regra do www usa **Wildcard pattern** e exige `https://www.arthuraugustinho.dev/*` com destino `https://arthuraugustinho.dev/${1}`: a primeira tentativa, sem `/*` e sem `${1}`, não casava com nada, porque o modo wildcard compara o endereço inteiro, com o caminho.
