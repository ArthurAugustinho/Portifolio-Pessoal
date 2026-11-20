// Estado global de movimento (MASTER, "Movimento"; home.md, "Controle de pausa").
//
// A fonte de verdade é o atributo data-movimento="pausado" | "ativo" em <html>:
// o CSS e os scripts leem o mesmo valor, e ele sobrevive à troca de página
// porque o layout raiz não é remontado. A preferência é guardada em
// localStorage, sempre com try/catch: se falhar, o estado só vale para a visita.
//
// Este módulo não importa React nem GSAP: o layout (Server Component) lê
// SCRIPT_MOVIMENTO daqui. O hook useMovimento fica em ControlePausa.tsx.

const CHAVE = 'movimento'
const REDUZIR = '(prefers-reduced-motion: reduce)'

// Roda no <head>, antes da primeira pintura e da hidratação, para não piscar
// movimento ao carregar. Padrão: pausado quando o sistema pede "reduzir
// movimento"; o que o visitante escolheu vence.
export const SCRIPT_MOVIMENTO = `(function(){var d=document.documentElement,p=matchMedia('${REDUZIR}').matches;try{var s=localStorage.getItem('${CHAVE}');if(s)p=s==='pausado'}catch(e){}d.dataset.movimento=p?'pausado':'ativo'})()`

export function movimentoPausado(): boolean {
  return document.documentElement.dataset.movimento === 'pausado'
}

// Reaplica o estado se o atributo sumiu. Em desenvolvimento, o Strict Mode do
// React limpa os atributos de <html> na segunda montagem; em produção é no-op.
export function garantirEstadoDeMovimento() {
  if (document.documentElement.dataset.movimento) return
  let pausado = window.matchMedia(REDUZIR).matches
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) pausado = salvo === 'pausado'
  } catch {
    // Sem armazenamento: vale a preferência do sistema.
  }
  document.documentElement.dataset.movimento = pausado ? 'pausado' : 'ativo'
  avisar()
}

export function definirPausado(pausado: boolean) {
  document.documentElement.dataset.movimento = pausado ? 'pausado' : 'ativo'
  try {
    localStorage.setItem(CHAVE, pausado ? 'pausado' : 'ativo')
  } catch {
    // A escolha vale só até recarregar.
  }
  avisar()
}

const ouvintes = new Set<() => void>()

function avisar() {
  for (const ouvinte of ouvintes) ouvinte()
}

// Para useSyncExternalStore e, na Etapa 4, para pausar ou matar timelines.
export function assinarMovimento(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => {
    ouvintes.delete(ouvinte)
  }
}
