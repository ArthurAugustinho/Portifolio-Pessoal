'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Campo } from '@/components/ui/Campo'
import { contatoSchema, type ContatoInput } from '@/lib/schemas'
import styles from './FormularioContato.module.css'

const EMAIL_CONTATO = 'arthuraugustinho35@gmail.com'
const MENSAGEM_ERRO_PADRAO = `Something went wrong. Try sending again or write directly to ${EMAIL_CONTATO}.`
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

// Só o que usamos da API do Turnstile (script externo, sem pacote).
type TurnstileApi = {
  render: (
    elemento: HTMLElement,
    opcoes: {
      sitekey: string
      appearance: 'interaction-only'
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type Estado = 'idle' | 'enviando' | 'sucesso' | 'erro'

export function FormularioContato() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensagemErro, setMensagemErro] = useState(MENSAGEM_ERRO_PADRAO)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ContatoInput>({
    defaultValues: { nome: '', email: '', mensagem: '', empresa: '', 'cf-turnstile-response': '' },
  })

  function montarWidget() {
    if (!SITE_KEY || !window.turnstile || !containerRef.current) return
    // Já renderizado (onReady roda de novo a cada montagem).
    if (containerRef.current.hasChildNodes()) return

    window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      appearance: 'interaction-only',
      callback: (token) => setValue('cf-turnstile-response', token),
      'expired-callback': () => setValue('cf-turnstile-response', ''),
      'error-callback': () => setValue('cf-turnstile-response', ''),
    })
  }

  // Sem id: o Turnstile atua no último widget renderizado, e esta página
  // tem só um.
  useEffect(() => {
    return () => window.turnstile?.remove()
  }, [])

  // O token do Turnstile vale para uma única verificação: depois de
  // qualquer resposta de erro, é preciso pedir outro.
  function renovarToken() {
    setValue('cf-turnstile-response', '')
    window.turnstile?.reset()
  }

  async function aoEnviar(dados: ContatoInput) {
    // Revalida no cliente com o mesmo schema usado no Worker: a validação
    // aqui é só de UX, quem decide de verdade é o Worker em /api/contato.
    const resultado = contatoSchema.safeParse(dados)

    if (!resultado.success) {
      // O foco vai para o primeiro campo com erro, como faria a
      // validação nativa do navegador.
      let focado = false
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof ContatoInput
        if (campo === 'cf-turnstile-response') {
          setMensagemErro(issue.message)
          setEstado('erro')
        } else {
          setError(campo, { type: 'zod', message: issue.message }, { shouldFocus: !focado })
          focado = true
        }
      }
      return
    }

    setEstado('enviando')

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultado.data),
      })

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null)
        setMensagemErro(typeof corpo?.erro === 'string' ? corpo.erro : MENSAGEM_ERRO_PADRAO)
        setEstado('erro')
        renovarToken()
        return
      }

      // O formulário (e o container do widget) sai da página: remover o
      // widget antes evita o aviso "Cannot find Widget" do Turnstile.
      window.turnstile?.remove()
      setEstado('sucesso')
    } catch {
      setMensagemErro(MENSAGEM_ERRO_PADRAO)
      setEstado('erro')
      renovarToken()
    }
  }

  if (estado === 'sucesso') {
    return (
      <p role="status" className={styles.sucesso}>
        Message sent. If you prefer, write directly to{' '}
        <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} className={styles.formulario} noValidate>
      {SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={montarWidget}
        />
      )}

      <Campo
        label="Name"
        autoComplete="name"
        erro={errors.nome?.message}
        {...register('nome')}
      />

      <Campo
        label="Email"
        type="email"
        autoComplete="email"
        spellCheck={false}
        erro={errors.email?.message}
        {...register('email')}
      />

      <Campo
        label="Message"
        as="textarea"
        rows={6}
        erro={errors.mensagem?.message}
        {...register('mensagem')}
      />

      <Campo honeypot {...register('empresa')} />

      {/* Desafio do Turnstile: só aparece se o Cloudflare julgar necessário. */}
      <div ref={containerRef} />

      {estado === 'erro' && (
        <p role="alert" className={styles.erroEnvio}>
          {mensagemErro}
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'} className={styles.botao}>
        {estado === 'enviando' ? 'Sending…' : 'Send'}
      </button>

      <p className={`t-dim ${styles.aviso}`}>
        Your name, email address and message are sent to me by email. See the{' '}
        <Link href="/privacy">privacy notice</Link> for details.
      </p>
    </form>
  )
}
