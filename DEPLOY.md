# Deploy na Vercel

Passo a passo para publicar. Nenhum destes passos foi executado — é para você seguir.

## 1. Pré-requisito: repositório no Git

Este diretório ainda não é um repositório Git. Antes de conectar à Vercel:

```
git init
git add .
git commit -m "primeira versão"
```

Depois crie um repositório vazio no GitHub (ou GitLab/Bitbucket) e faça o push:

```
git remote add origin <url-do-repositorio>
git push -u origin main
```

Alternativa sem Git: instalar a CLI da Vercel (`npm i -g vercel`) e rodar `vercel` dentro
da pasta do projeto. Funciona, mas você perde deploy automático a cada push e preview
por pull request — prefira o fluxo com Git se for manter o projeto.

## 2. Criar o projeto na Vercel

1. Entre em vercel.com com sua conta, clique em "Add New" → "Project".
2. Importe o repositório que você acabou de criar.
3. A Vercel detecta Next.js automaticamente — não precisa mudar build command
   nem output directory.

## 3. Variáveis de ambiente

Antes de clicar em "Deploy", abra a seção "Environment Variables" da tela de
importação (ou depois em Project → Settings → Environment Variables). Cadastre:

| Nome | Valor | Ambientes | Observação |
|---|---|---|---|
| `RESEND_API_KEY` | chave da sua conta em resend.com | Production, Preview | secreta — nunca prefixar com `NEXT_PUBLIC_` |
| `CONTACT_TO_EMAIL` | email que recebe as mensagens do formulário | Production, Preview | |
| `CONTACT_FROM_EMAIL` | remetente verificado no Resend | Production, Preview | precisa ser de um domínio verificado no Resend, senão o envio falha |
| `NEXT_PUBLIC_SITE_URL` | `https://SEU-DOMINIO.com` (ou a URL `.vercel.app` até ter domínio próprio) | Production, Preview | usada em metadata, robots.txt e sitemap.xml |
| `NEXT_PUBLIC_INDEXAVEL` | `false` | Production, Preview | **deixe `false` até o conteúdo dos projetos sair de TODO.** Só então mude para `true` — isso libera o robots.txt para os buscadores indexarem o site |

Sem `RESEND_API_KEY`/`CONTACT_TO_EMAIL`/`CONTACT_FROM_EMAIL` configuradas, o
formulário de contato responde com erro genérico ao visitante e grava no log
da função (Vercel → Deployments → seu deploy → Functions → `/api/contato`)
qual variável está faltando.

## 4. Deploy

Clique em "Deploy". A Vercel builda e publica em uma URL `algo.vercel.app`.
Depois de configurar `NEXT_PUBLIC_SITE_URL` pela primeira vez (ou de trocar
o valor), redeploy é necessário — variável de ambiente não se aplica a um
deploy que já rodou.

## 5. Domínio próprio

1. Project → Settings → Domains → escreva o domínio e clique em "Add".
2. A Vercel mostra os registros DNS a criar (em geral um `A` ou `CNAME`
   apontando para a Vercel). Cadastre esses registros no painel de DNS de
   onde o domínio foi comprado.
3. Espere a propagação (minutos a algumas horas). A Vercel emite HTTPS
   automaticamente quando o DNS resolve.
4. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio definitivo e faça um
   redeploy (passo 4).

## 6. Depois do primeiro deploy

- Cada `git push` na branch principal gera um novo deploy de produção;
  push em outras branches ou PRs gera preview deploy com URL própria.
- Enquanto `NEXT_PUBLIC_INDEXAVEL` estiver `false`, o site funciona
  normalmente mas `/robots.txt` bloqueia todo crawler — é o estado
  esperado enquanto o conteúdo dos projetos for TODO.
