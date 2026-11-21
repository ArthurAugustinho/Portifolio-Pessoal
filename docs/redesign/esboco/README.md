# Esboço aprovado (referência)

Cópia do esboço da home aprovado pelo autor em 2026-11-19 no canvas de design do Claude:

- `Main.dc.html`: home no desktop (1440px), com o comportamento simulado.
- `CardAberto.dc.html`: prévia do projeto aberta.
- `HomeMobile.dc.html`: home no celular (390px), estado final parado.

Estes arquivos não rodam fora do canvas e não fazem parte do build. Servem para conferir valores (cores, tamanhos, espaçamentos, textos) e o comportamento descrito em `docs/redesign/home.md`.

Não copie a estrutura: os estilos são inline, a lógica usa a classe `DCLogic` do canvas e as cores aparecem em hex. No site, tudo passa pelos tokens do `MASTER.md` e por CSS Modules. Onde o esboço e os documentos divergirem, valem os documentos (ver a precedência no topo de `home.md`). Duas divergências conhecidas: a órbita é CSS 3D, não R3F (ADR 0014), e os ícones são do Simple Icons com monograma de reserva (ADR 0016).
