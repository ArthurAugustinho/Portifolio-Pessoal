import { NextResponse } from 'next/server'
import { contatoSchema, type ContatoInput } from '@/lib/schemas'

const MENSAGEM_ERRO_GENERICA = 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.'

const LIMITE_ENVIOS = 3
const JANELA_MS = 10 * 60 * 1000
const registrosPorIp = new Map<string, number[]>()

function obterIp(request: Request): string {
  const encaminhado = request.headers.get('x-forwarded-for')
  if (encaminhado) {
    return encaminhado.split(',')[0]!.trim()
  }
  return request.headers.get('x-real-ip') ?? 'desconhecido'
}

function estaDentroDoLimite(ip: string): boolean {
  const agora = Date.now()
  const envios = (registrosPorIp.get(ip) ?? []).filter((timestamp) => agora - timestamp < JANELA_MS)

  if (envios.length >= LIMITE_ENVIOS) {
    registrosPorIp.set(ip, envios)
    return false
  }

  envios.push(agora)
  registrosPorIp.set(ip, envios)
  return true
}

async function enviarEmail(dados: ContatoInput) {
  const resposta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: dados.email,
      subject: `Novo contato de ${dados.nome}`,
      text: `${dados.mensagem}\n\n— ${dados.nome} (${dados.email})`,
    }),
  })

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => '')
    throw new Error(`Resend respondeu ${resposta.status}: ${corpo}`)
  }
}

export async function POST(request: Request) {
  let corpo: unknown

  try {
    corpo = await request.json()
  } catch {
    return NextResponse.json({ erro: 'Requisição inválida.' }, { status: 400 })
  }

  // honeypot: um visitante real nunca preenche "empresa". Se veio
  // preenchido, é bot — finge sucesso e descarta em silêncio.
  const honeypot =
    corpo && typeof corpo === 'object' && 'empresa' in corpo
      ? (corpo as { empresa?: unknown }).empresa
      : undefined

  if (typeof honeypot === 'string' && honeypot !== '') {
    return NextResponse.json({ ok: true })
  }

  const ip = obterIp(request)
  if (!estaDentroDoLimite(ip)) {
    return NextResponse.json(
      { erro: 'Você enviou várias mensagens recentemente. Tente novamente em alguns minutos.' },
      { status: 429 },
    )
  }

  const resultado = contatoSchema.safeParse(corpo)
  if (!resultado.success) {
    return NextResponse.json({ erro: 'Confira os campos e tente novamente.' }, { status: 400 })
  }

  const variaveisFaltando = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'].filter(
    (nome) => !process.env[nome],
  )

  if (variaveisFaltando.length > 0) {
    console.error(
      `/api/contato: variável(is) de ambiente ausente(s): ${variaveisFaltando.join(', ')}. Configure-as antes de usar o formulário de contato.`,
    )
    return NextResponse.json({ erro: MENSAGEM_ERRO_GENERICA }, { status: 500 })
  }

  try {
    await enviarEmail(resultado.data)
    return NextResponse.json({ ok: true })
  } catch (erro) {
    console.error('/api/contato: falha ao enviar via Resend.', erro)
    return NextResponse.json({ erro: MENSAGEM_ERRO_GENERICA }, { status: 502 })
  }
}
