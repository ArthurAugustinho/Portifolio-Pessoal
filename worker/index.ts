import { contatoSchema } from '../lib/schemas'

// Worker da Cloudflare (ADR 0005 e 0007). O wrangler.jsonc só o executa para
// /api/*; todo o resto do site sai de out/ como arquivo estático.

type Env = {
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
  TURNSTILE_SECRET_KEY?: string
  // Só para teste local: aponta o envio para um servidor simulado.
  RESEND_API_URL?: string
}

const RESEND_URL_PADRAO = 'https://api.resend.com/emails'
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 10_000
const TAMANHO_MAXIMO_CORPO = 10_000

const ERRO_GENERICO = 'Your message could not be sent right now. Please try again later.'

function json(corpo: unknown, status: number, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  })
}

// O cliente só vê mensagem genérica; o detalhe fica no log do Worker.
function logar(contexto: string, erro?: unknown) {
  console.error(`/api/contato: ${contexto}`, {
    detalhe: erro instanceof Error ? erro.message : erro === undefined ? undefined : String(erro),
  })
}

async function fetchComTimeout(url: string, init: RequestInit): Promise<Response> {
  const controlador = new AbortController()
  const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controlador.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function verificarTurnstile(token: string, secret: string, ip: string | null) {
  const form = new URLSearchParams({ secret, response: token })
  if (ip) form.set('remoteip', ip)

  const resposta = await fetchComTimeout(TURNSTILE_URL, { method: 'POST', body: form })
  if (!resposta.ok) {
    throw new Error(`Turnstile respondeu ${resposta.status}`)
  }
  const dados = (await resposta.json()) as { success?: boolean }
  return dados.success === true
}

// Quebras de linha no assunto nunca viram cabeçalho extra: o envio usa o
// JSON estruturado da Resend, e o nome ainda é achatado por precaução.
const QUEBRAS_DE_LINHA = new RegExp(`[${String.fromCharCode(13, 10, 0x2028, 0x2029)}]+`, 'g')

function acharEmLinha(texto: string) {
  return texto.replace(QUEBRAS_DE_LINHA, ' ').trim()
}

async function enviarEmail(env: Env, nome: string, email: string, mensagem: string) {
  const resposta = await fetchComTimeout(env.RESEND_API_URL || RESEND_URL_PADRAO, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New contact from ${acharEmLinha(nome)}`,
      text: `${mensagem}\n\n— ${acharEmLinha(nome)} (${email})`,
    }),
  })

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => '')
    throw new Error(`Resend respondeu ${resposta.status}: ${detalhe.slice(0, 500)}`)
  }
}

async function tratarContato(request: Request, env: Env): Promise<Response> {
  const texto = await request.text()
  if (texto.length > TAMANHO_MAXIMO_CORPO) {
    return json({ erro: 'Invalid request.' }, 413)
  }

  let corpo: unknown
  try {
    corpo = JSON.parse(texto)
  } catch {
    return json({ erro: 'Invalid request.' }, 400)
  }

  // Honeypot antes do schema: se o .strict() rodasse primeiro, o bot
  // receberia 400 em vez do sucesso falso (ADR 0007).
  const honeypot =
    corpo && typeof corpo === 'object' && 'empresa' in corpo
      ? (corpo as { empresa?: unknown }).empresa
      : undefined
  if (typeof honeypot === 'string' && honeypot !== '') {
    return json({ ok: true }, 200)
  }

  const resultado = contatoSchema.safeParse(corpo)
  if (!resultado.success) {
    return json({ erro: 'Check the fields and try again.' }, 400)
  }

  const ausentes = (
    ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'TURNSTILE_SECRET_KEY'] as const
  ).filter((nome) => !env[nome])
  if (ausentes.length > 0) {
    logar(`variável(is) ausente(s): ${ausentes.join(', ')}`)
    return json({ erro: ERRO_GENERICO }, 500)
  }

  const { nome, email, mensagem } = resultado.data
  const token = resultado.data['cf-turnstile-response']

  try {
    const humano = await verificarTurnstile(
      token,
      env.TURNSTILE_SECRET_KEY as string,
      request.headers.get('CF-Connecting-IP'),
    )
    if (!humano) {
      logar('Turnstile reprovou o token')
      return json({ erro: 'Verification failed. Please try again.' }, 400)
    }
  } catch (erro) {
    logar('falha ao verificar o Turnstile', erro)
    return json({ erro: ERRO_GENERICO }, 502)
  }

  try {
    await enviarEmail(env, nome, email, mensagem)
    return json({ ok: true }, 200)
  } catch (erro) {
    logar('falha ao enviar pela Resend', erro)
    return json({ erro: ERRO_GENERICO }, 502)
  }
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const { pathname } = new URL(request.url)

      if (pathname !== '/api/contato') {
        return json({ erro: 'Not found.' }, 404)
      }
      if (request.method !== 'POST') {
        return json({ erro: 'Method not allowed.' }, 405, { Allow: 'POST' })
      }
      return await tratarContato(request, env)
    } catch (erro) {
      logar('erro inesperado', erro)
      return json({ erro: ERRO_GENERICO }, 500)
    }
  },
}

export default worker
