# 0010. Registrar domínio próprio para o site e o envio de e-mail

- Status: Aceita (nome, registrador e host canônico ainda não definidos)
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

TODO: definir o nome do domínio.
TODO: definir o registrador. A Cloudflare Registrar centraliza DNS e hospedagem, mas concentra tudo num único fornecedor.
TODO: definir o host canônico (com ou sem `www`); o outro redireciona.

## Consequências
- Positivas: URL que sobrevive a trocas de host; e-mail do formulário entregue por domínio verificado; pré-requisito para a Fase 6 (Search Console, liberar a indexação).
- Negativas / custos assumidos: custo anual de registro; registros DNS a manter; domínio expirado derruba site e e-mail juntos, então a renovação automática precisa ficar ativa; o subdomínio `*.workers.dev` continua respondendo e precisa de `X-Robots-Tag: noindex` ou redirect para não competir com o domínio na busca.
- O que faria esta decisão ser revista: nenhuma condição previsível; só o nome ou o registrador poderiam mudar.
