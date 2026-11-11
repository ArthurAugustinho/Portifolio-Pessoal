# 0001. Conteúdo dos projetos em MDX no repositório, sem banco

- Status: Aceita
- Data: 2026-08-19 (decisão anterior ao primeiro commit; registrada retroativamente em 2026-11-11)

## Contexto
O portfólio publica poucos estudos de caso longos (texto, trechos de código, imagens e vídeo), editados por uma única pessoa e atualizados poucas vezes por ano. O site é estático: não há backend nem banco. O visitante típico é recrutador ou tech lead e passa menos de dois minutos no site, então o valor está no conteúdo, não na infraestrutura que o serve.

Registro retroativo: o contexto vem das anotações do projeto.

## Alternativas consideradas
### A. MDX no repositório (`content/projetos/*.mdx`)
- Prós: conteúdo versionado junto com o código e revisável por diff; zero infraestrutura e zero custo; texto puro e portável; o build gera páginas estáticas.
- Contras: editar exige Git e um novo deploy; não há editor visual; conteúdo e código compartilham o mesmo ciclo de publicação.

### B. Banco de dados com painel administrativo
- Prós: edição sem deploy; o próprio site demonstraria backend.
- Contras: servidor, banco e autenticação para manter e proteger; custo recorrente; superfície de ataque grande para um conteúdo que quase não muda.

### C. CMS headless
- Prós: editor visual; conteúdo separado do código.
- Contras: conta e dependência externas, formato preso ao fornecedor, mais uma superfície de ataque. O Playbook do Devkit só recomenda CMS quando há demanda real de edição por terceiros.

TODO: confirmar se B e C foram de fato avaliadas na época ou se a escolha por A foi direta.

## Decisão
A. MDX no repositório, com frontmatter lido por `gray-matter` em `lib/projetos.ts`. Pesaram mais a simplicidade e a portabilidade: um único editor e volume baixo não justificam servidor nem conta externa.

## Consequências
- Positivas: build totalmente estático; conteúdo portável para qualquer framework; histórico de cada texto no Git.
- Negativas / custos assumidos: o frontmatter não é validado hoje, e um campo obrigatório ausente vira `undefined` sem erro (a validação com Zod na CI resolve isso); com o site bilíngue (0004), cada projeto passa a ter dois arquivos para manter.
- O que faria esta decisão ser revista: outra pessoa precisar editar sem Git, ou o volume crescer para dezenas de entradas com atualização frequente (por exemplo, um blog ativo).
