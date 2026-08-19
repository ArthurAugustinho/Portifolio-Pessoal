'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Campo } from '@/components/ui/Campo'
import { contatoSchema, type ContatoInput } from '@/lib/schemas'
import styles from './FormularioContato.module.css'

const EMAIL_CONTATO = 'arthuraugustinho35@gmail.com'
const MENSAGEM_ERRO_PADRAO = `Não deu certo. Tente enviar de novo ou escreva direto para ${EMAIL_CONTATO}.`

type Estado = 'idle' | 'enviando' | 'sucesso' | 'erro'

export function FormularioContato() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensagemErro, setMensagemErro] = useState(MENSAGEM_ERRO_PADRAO)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContatoInput>({
    defaultValues: { nome: '', email: '', mensagem: '', empresa: '' },
  })

  async function aoEnviar(dados: ContatoInput) {
    // revalida no cliente com o mesmo schema usado na API — a
    // validação do react-hook-form aqui é só de UX, quem decide
    // de verdade é a rota /api/contato.
    const resultado = contatoSchema.safeParse(dados)

    if (!resultado.success) {
      for (const issue of resultado.error.issues) {
        const campo = issue.path[0] as keyof ContatoInput
        setError(campo, { type: 'zod', message: issue.message })
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
        return
      }

      setEstado('sucesso')
    } catch {
      setMensagemErro(MENSAGEM_ERRO_PADRAO)
      setEstado('erro')
    }
  }

  if (estado === 'sucesso') {
    return (
      <p className={styles.sucesso}>
        Mensagem enviada. Se preferir, escreva direto para{' '}
        <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} className={styles.formulario} noValidate>
      <Campo label="Nome" erro={errors.nome?.message} {...register('nome')} />

      <Campo label="Email" type="email" erro={errors.email?.message} {...register('email')} />

      <Campo
        label="Mensagem"
        as="textarea"
        rows={6}
        erro={errors.mensagem?.message}
        {...register('mensagem')}
      />

      <Campo honeypot {...register('empresa')} />

      {estado === 'erro' && (
        <p role="alert" className={styles.erroEnvio}>
          {mensagemErro}
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'} className={styles.botao}>
        {estado === 'enviando' ? 'Enviando' : 'Enviar'}
      </button>
    </form>
  )
}
