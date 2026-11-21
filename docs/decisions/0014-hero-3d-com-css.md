# 0014. Órbita 3D do hero em CSS 3D, sem three.js

- Status: Aceita
- Data: 2026-11-20

## Contexto
O hero tem uma órbita em volta da foto: anel externo, anel interno tracejado, quatro nós com rótulos (Browser, Network edge, API, Database) e um pacote âmbar que percorre o anel. O esboço anotou "cena R3F; o mouse inclina o anel em profundidade (até 6°); celular sem inclinação". No questionário, o autor pediu um 3D "rápido, sem que pese muito".

A cena não tem nenhum objeto com volume, luz, sombra ou material: são planos (anéis, nós, texto) que precisam de profundidade e inclinação.

## Alternativas consideradas
### A. React Three Fiber com three.js
- Prós: 3D de verdade; abre espaço para cenas futuras com volume.
- Contras: o three.js sozinho passaria a ser a maior dependência do site (medir; a ordem de grandeza é de mais de 100 KB gzip); precisa de contexto WebGL e de fallback quando ele falha; rótulos viram HTML posicionado sobre o canvas; alguns utilitários do drei buscam arquivos em CDN, o que a CSP (0008) bloqueia; tudo isso para desenhar dois círculos.

### B. CSS 3D sobre o SVG atual
- Prós: nenhum KB a mais; `perspective`, `rotateX`/`rotateY` e `translateZ` são compostos pela GPU; rótulos continuam texto real; funciona sem WebGL e em qualquer navegador atual.
- Contras: só profundidade em planos (parallax), não geometria com volume.

### C. WebGL próprio ou biblioteca mínima (OGL)
- Prós: mais leve que o three.js.
- Contras: escrever shaders e matemática de câmera para o mesmo resultado que B entrega sem código gráfico.

## Decisão
B. A órbita é um contêiner com `perspective` e camadas em `transform-style: preserve-3d`:

- anel tracejado recuado (`translateZ(-40px)`), anel externo no plano zero, nós e rótulos à frente (`translateZ(24px)`), foto plana no centro;
- o pacote percorre o anel externo numa volta de 14 s;
- no desktop com ponteiro fino, o mouse inclina o conjunto até 6° em cada eixo, suavizado com `gsap.quickTo` (0013);
- no celular, órbita menor e sem inclinação;
- com "reduzir movimento" ou pausa global: pacote parado na posição inicial e sem inclinação.

Esta decisão corrige a nota "n3d" do esboço; o resultado visual aprovado não muda.

## Consequências
- Positivas: o 3D não pesa nada no orçamento de JavaScript; menos superfície de erro; nada de terceiros.
- Negativas / custos assumidos: sem volume, iluminação ou modelos; se o autor quiser um objeto 3D de verdade, é outra decisão.
- O que faria esta decisão ser revista: pedido de uma cena com volume (um globo de nós, um modelo). Nesse caso, R3F volta como etapa própria, só no desktop, carregado depois do LCP, com orçamento próprio e sem utilitários que busquem arquivos em CDN.
