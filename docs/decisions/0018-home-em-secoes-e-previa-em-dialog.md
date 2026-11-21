# 0018. Home em seções e prévia de projeto em `<dialog>`

- Status: Aceita
- Data: 2026-11-20

## Contexto
O autor pediu: o site começa na home; "Sobre" tem página própria; os projetos ficam num carrossel de cards; o clique num card abre uma prévia do projeto com um botão que leva à página dedicada; privacidade e contato continuam com página própria.

O esboço aprovado organiza a home como uma página longa com as seções About, Stack, Experience, Projects, Blog e Contact. O header mostra o caminho da seção atual (`/about`, `/stack`...) e sublinha o item do menu correspondente.

## Alternativas consideradas
Para a navegação:

### A. Home longa com âncoras, e Sobre como resumo na home mais página própria
- Prós: segue o esboço e o pedido; o visitante com pouco tempo vê tudo rolando; `/sobre` continua para quem quer a história completa.
- Contras: a home fica mais pesada que a atual; o conteúdo de Stack e Experience aparece em dois lugares (home e `/sobre`), o que exige uma fonte única.

### B. Cada item do menu como página
- Prós: páginas leves.
- Contras: contraria o esboço; o visitante precisa clicar para ver qualquer coisa.

Para a prévia do projeto:

### C. `<dialog>` nativo aberto com `showModal()`
- Prós: foco preso no diálogo, Esc fecha, o fundo fica inerte e o foco volta ao card, tudo pelo navegador; funciona no export estático.
- Contras: a transição card → diálogo (Flip) precisa medir os dois retângulos, porque o diálogo fica na camada superior.

### D. Card que cresce dentro do carrossel
- Prós: nenhuma camada nova.
- Contras: num carrossel horizontal, o card crescendo empurra os vizinhos e faz o layout pular; foco e Esc ficam por conta do código.

### E. Rota interceptada do Next (modal com URL própria)
- Prós: prévia compartilhável por link.
- Contras: mais complexidade de roteamento, e o comportamento no export estático precisaria ser verificado; a página do projeto já é o endereço compartilhável.

## Decisão
A e C.

- Os itens do menu apontam para as seções da home (`#about`...; em páginas internas, `/#about`). O caminho mostrado no header é visual (`aria-hidden`) e não muda a URL.
- A seção About da home é um resumo com link para `/sobre`. Stack, Experience, a ficha do About e os contatos saem de uma fonte única tipada (`content/perfil.ts`), usada pela home e por `/sobre`.
- A prévia é um `<dialog>` com título (`aria-labelledby`), resumo, ícones da stack, "The problem" e o botão "View project" para `/projetos/[slug]`. Não tem URL própria. A transição Flip entra na etapa do carrossel interativo; antes dela, o diálogo abre sem animação.
- `/contato` (com o formulário da 0007) e `/privacy` continuam como páginas; a seção Contact da home leva a elas.

## Consequências
- Positivas: navegação do esboço sem recursos de roteamento novos; acessibilidade do modal fica com o navegador.
- Negativas / custos assumidos: a home concentra mais conteúdo e mais JavaScript, então é a página que define o orçamento de desempenho; `content/perfil.ts` vira um arquivo de conteúdo fora do MDX (os textos curtos de perfil não justificam MDX).
- O que faria esta decisão ser revista: dados de visita mostrando que pouca gente passa do hero; pedido de compartilhar a prévia por link.
