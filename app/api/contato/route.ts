import { NextResponse } from 'next/server'
import { contatoSchema, type ContatoInput } from '@/lib/schemas'

const MENSAGEM_ERRO_GENERICA = 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.'

const LIMITE_ENVIOS = 3
const JANELA_MS = 10 * 60 * 1000
const TIMEOUT_RESEND_MS = 10 * 1000
const registrosPorIp = new Map<string, number[]>()

function obterIp(request: Request): string {
  const encaminhado = request.headers.get('x-forwarded-for')
  if (encaminhado) {
    return encaminhado.split(',')[0]?.trim() || 'desconhecido'
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

function logarErro(contexto: string, erro: unknown) {
  console.error(`/api/contato: ${contexto}`, {
    mensagem: erro instanceof Error ? erro.message : String(erro),
    stack: erro instanceof Error ? erro.stack : undefined,
  })
}

// Resend normalmente responde JSON no erro, mas uma falha na borda deles
// (proxy, outage) pode devolver HTML/texto — nunca assumir o formato.
async function lerCorpoDeErro(resposta: Response): Promise<string> {
  const texto = await resposta.text().catch(() => '')
  try {
    const json = JSON.parse(texto)
    return typeof json?.message === 'string' ? json.message : texto
  } catch {
    return texto
  }
}

async function enviarEmail(dados: ContatoInput) {
  const controlador = new AbortController()
  const timeout = setTimeout(() => controlador.abort(), TIMEOUT_RESEND_MS)

  let resposta: Response
  try {
    resposta = await fetch('https://api.resend.com/emails', {
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
      signal: controlador.signal,
    })
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new Error(`Resend não respondeu em ${TIMEOUT_RESEND_MS}ms (timeout).`)
    }
    // Qualquer falha de rede (DNS, conexão recusada etc.) cai aqui.
    // Relançar como Error garante mensagem e stack para o log, mesmo
    // que o valor original lançado por fetch não seja um Error.
    throw new Error(
      `Falha de rede ao chamar a Resend: ${erro instanceof Error ? erro.message : String(erro)}`,
    )
  } finally {
    clearTimeout(timeout)
  }

  if (!resposta.ok) {
    const detalhe = await lerCorpoDeErro(resposta)
    throw new Error(`Resend respondeu ${resposta.status}: ${detalhe}`)
  }
}

export async function POST(request: Request) {
  // Rede de segurança externa: nada escapa sem resposta, mesmo uma
  // falha totalmente inesperada em algum ponto acima do envio.
  try {
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
      logarErro('falha ao enviar via Resend.', erro)
      return NextResponse.json({ erro: MENSAGEM_ERRO_GENERICA }, { status: 502 })
    }
  } catch (erro) {
    logarErro('erro inesperado fora do fluxo previsto.', erro)
    return NextResponse.json({ erro: MENSAGEM_ERRO_GENERICA }, { status: 500 })
  }
}
