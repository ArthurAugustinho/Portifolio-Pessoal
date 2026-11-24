# 0019. Contato só por e-mail, sem formulário

- Status: Aceita (substitui a 0007)
- Data: 2026-11-24

## Contexto
A 0007 colocou o formulário de contato num Worker, com Resend para o envio e Turnstile contra bots. Com o domínio no ar (0010), faltava verificar o domínio na Resend (SPF, DKIM e DMARC), criar o widget do Turnstile, guardar quatro secrets no Worker e testar o envio de ponta a ponta. Enquanto isso, o site publicado já funcionava sem formulário: sem a chave do Turnstile na build, `/contato` mostrava só o e-mail com `mailto:`.

O público é de recrutadores e tech leads, que costumam escrever do próprio e-mail, e o autor já recebe tudo no mesmo endereço.

## Alternativas consideradas
### A. Só o e-mail, com o formulário e o Worker removidos
- Prós: nenhum terceiro além da própria Cloudflare; nenhum secret; nenhuma conta nova; menos código e menos superfície de ataque; CSP mais restrita; política de privacidade mais curta (o site não recebe dado nenhum); o site vira 100% estático.
- Contras: quem visita precisa abrir o próprio programa de e-mail; o endereço fica em texto no HTML e pode ser coletado por robôs de spam.

### B. Manter o formulário e concluir Resend e Turnstile (a 0007)
- Prós: contato sem sair da página; o e-mail do autor não precisa aparecer.
- Contras: duas contas, quatro secrets e verificação de domínio para manter; envio que pode falhar sem o visitante saber; dados pessoais passando por mais dois serviços.

### C. Manter o código do formulário desligado
- Prós: reativar depois custa pouco.
- Contras: código morto com CSP e secrets associados, e quem lê o repositório não sabe se é para usar. O histórico do git já guarda a versão antiga.

## Decisão
A. O contato é só o e-mail `arthuraugustinho35@gmail.com`, em `mailto:` na home e em `/contato`. Saem o formulário, o Worker, o Turnstile, o Resend e o `react-hook-form`. O `zod` fica, porque valida o conteúdo dos projetos. O `wrangler.jsonc` passa a publicar só os arquivos de `out/`.

Decisão do autor.

## Consequências
- Positivas: o site é estático de ponta a ponta; sem secrets, sem `/api`; a CSP perde o Turnstile (`script-src` só com o beacon do Web Analytics e `frame-src 'none'`); `/privacy` fala só de analytics, da preferência de animação e do e-mail recebido.
- Negativas / custos assumidos: o contato depende de o visitante ter um programa de e-mail configurado; o endereço fica exposto a coleta por robôs.
- A versão com formulário está no histórico do git, no commit anterior a este.
- O que faria esta decisão ser revista: clientes de freelance que não escrevem por e-mail, ou volume de spam no endereço que justifique o formulário.
