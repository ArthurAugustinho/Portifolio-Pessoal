# 0015. Fundo de partículas em canvas 2D próprio

- Status: Aceita
- Data: 2026-11-20

## Contexto
O esboço tem uma rede de partículas fixa atrás do site inteiro: pontos que se movem devagar, ligações entre pontos próximos e ligações até o cursor (modo "grab"). Parâmetros do esboço: até 80 partículas no desktop e cerca de 30 no celular, ligação até 140 px, alcance do cursor de 170 px, velocidade de 0,25 px por quadro.

O autor pediu inicialmente o tsParticles (licença MIT), a biblioteca do site de referência. Na versão proposta desta ADR, a recomendação de quem a escreveu já era o canvas próprio; ao aceitar as ADRs do redesign, em 2026-11-20, o autor escolheu a alternativa B.

## Alternativas consideradas
### A. `@tsparticles/slim` com o componente React oficial
- Prós: configuração declarativa; interações e casos de borda (redimensionamento, densidade de pixels, visibilidade da aba) já resolvidos e testados pela biblioteca.
- Contras: um motor genérico, com muito mais recursos do que este efeito usa; três dependências (`@tsparticles/slim`, `@tsparticles/engine`, `@tsparticles/react`) e mais atualizações para acompanhar; peso no JavaScript de todas as páginas.

### B. Canvas 2D próprio
- Prós: o esboço já tem uma versão funcional com cerca de 100 linhas; peso desprezível; nenhuma dependência; controle total sobre pausa, contagem e cores.
- Contras: código próprio para manter e testar (redimensionamento, densidade de pixels, aba oculta, toque).

### C. Sem partículas
- Prós: zero custo.
- Contras: perde um elemento do esboço aprovado.

## Decisão
B, por decisão do autor. Regras:

- `<canvas>` com `aria-hidden="true"`, `pointer-events: none` e camada abaixo do conteúdo.
- Inicia depois do primeiro paint útil (`requestIdleCallback`, com `setTimeout` de reserva), nunca no caminho do LCP.
- Pausa com a aba oculta e com a pausa global; quantidade de partículas proporcional à área da tela (até 80 no desktop, 30 no celular); densidade de pixels limitada a 2.
- Cores lidas dos tokens (`--line-3` para pontos e ligações, `--ink-mute` para as ligações do cursor) via `getComputedStyle`, nunca hex no componente.
- Ligações ao cursor só com `pointer: fine`.
- Com "reduzir movimento": um quadro parado, sem ligações ao cursor.
- Orçamento: na etapa em que as partículas entram, se o Lighthouse mobile da home cair mais de 3 pontos ou o Total Blocking Time subir mais de 50 ms em relação à etapa anterior, reduza a contagem e o custo por quadro antes de qualquer outra mudança, e relate os números ao autor.

## Consequências
- Positivas: nenhuma dependência nova; menos JavaScript em todas as páginas; pausa e cores sob controle do projeto.
- Negativas / custos assumidos: o código de redimensionamento, densidade de pixels, aba oculta e toque é nosso; o efeito roda em todas as páginas, então o custo dele vale para o site inteiro.
- O que faria esta decisão ser revista: orçamento estourado mesmo com a contagem reduzida; problema de bateria ou de aquecimento relatado em celular; pedido de efeitos que justifiquem um motor pronto.
