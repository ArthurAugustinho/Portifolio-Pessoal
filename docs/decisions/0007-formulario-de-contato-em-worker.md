# 0007. Formulário de contato em Worker, seguindo a receita do Devkit

- Status: Substituída pela 0019 (o formulário, o Worker, o Turnstile e o Resend foram removidos em 2026-11-24)
- Data: 2026-11-10

## Contexto
O formulário atual (React Hook Form + Zod + Resend) roda como route handler `POST /api/contato`, o que o export estático não suporta (0005). Comparado à receita "Formulário de contato seguro" do Devkit, ele tem quatro lacunas:

- não há desafio anti-bot verificado no servidor, só o honeypot;
- o schema Zod não é estrito: campos desconhecidos são descartados em silêncio em vez de rejeitados;
- o rate limit fica em memória, o que não limita de verdade em serverless, porque cada instância tem memória própria e efêmera;
- não há aviso sobre o uso dos dados.

O remetente atual, `onboarding@resend.dev`, é um domínio de testes da Resend que só entrega para o e-mail dono da conta (ver 0010).

## Alternativas consideradas
### A. Remover o formulário
- Prós: nenhum dado pessoal processado pelo site; nada de Worker para manter.
- Contras: perde quem prefere escrever pelo site; o e-mail fica exposto como único canal.

### B. Worker sem Turnstile
- Prós: nenhum script de terceiro na página.
- Contras: o honeypot vira a única camada anti-spam, o que a receita considera insuficiente.

### C. Worker seguindo a receita
- Prós: anti-spam em camadas verificado no servidor; validação estrita; mesmo padrão dos sites de clientes.
- Contras: script de terceiro na página; código fora do Next.js.

## Decisão
C.

- Um Worker atende `POST /api/contato`.
- `lib/schemas.ts` continua sendo a fonte única do schema, usado no cliente e no Worker, agora com `.strict()`.
- O token do Cloudflare Turnstile é verificado no servidor; o honeypot continua respondendo sucesso falso.
- O rate limit em memória sai.
- O envio pela Resend continua com campos estruturados, sem cabeçalho montado a partir da entrada do usuário.
- A chave da Resend e o segredo do Turnstile ficam como secrets do Worker.
- O cliente recebe erro genérico; o detalhe vai só para o log.
- O formulário ganha um aviso curto com link para a página de privacidade.

## Consequências
- Positivas: primeiro uso real da receita, que então registra o uso e o histórico (Fase 7); proteção anti-spam sem custo.
- Negativas / custos assumidos:
  - O Turnstile é script de terceiro, então entra na CSP (0008) e na política de privacidade.
  - O Worker tem build e testes próprios, fora do `next build`.
  - Em `localhost`, o Turnstile exige as chaves de teste dele.
  - Sem rate limit próprio, a proteção contra volume depende do Turnstile e dos limites da Cloudflare e da Resend.
- O que faria esta decisão ser revista: spam passando pelo Turnstile, ou volume que justifique rate limit com armazenamento externo (KV).
