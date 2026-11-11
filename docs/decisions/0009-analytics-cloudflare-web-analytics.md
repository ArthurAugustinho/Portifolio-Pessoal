# 0009. Cloudflare Web Analytics para métricas de visita

- Status: Aceita
- Data: 2026-11-10

## Contexto
O site é usado em candidaturas de emprego e para captar freelance, e hoje não há como saber se as páginas são visitadas, por exemplo se recrutadores abrem o estudo de caso do Pass+. O Devkit prefere analytics sem cookies: cookie não essencial exige consentimento prévio (UK GDPR/PECR no Reino Unido, LGPD no Brasil). O host passa a ser a Cloudflare (0005).

## Alternativas consideradas
### A. Nenhum analytics
- Prós: nenhum script extra; nada a declarar na política de privacidade além do formulário.
- Contras: nenhuma informação sobre o alcance do portfólio.

### B. Cloudflare Web Analytics
- Prós: gratuito; segundo a Cloudflare, não usa estado no cliente (cookies ou localStorage) para coletar as métricas; mesmo provedor do host; nenhum pacote npm; inclui Core Web Vitals de visitantes reais.
- Contras: script de terceiro; dados só agregados.

## Decisão
B. Sem banner de consentimento, porque não há cookie não essencial. Isso precisa ser verificado na revisão pré-lançamento.

## Consequências
- Positivas: visitas, páginas, origem do tráfego e desempenho real, sem custo e sem cookies.
- Negativas / custos assumidos: o script entra na CSP (0008) e na política de privacidade; os dados são agregados, então não mostram qual empresa visitou; bloqueadores de conteúdo impedem parte da coleta, e os números ficam subestimados.
- O que faria esta decisão ser revista: necessidade de eventos específicos (por exemplo, clique em "baixar CV") que a ferramenta não registre, ou mudança na política de privacidade da Cloudflare.
