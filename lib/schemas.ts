import { z } from 'zod'

// O Zod 4 testa Function('') para ativar o JIT; com a CSP do ADR 0008 (sem
// 'unsafe-eval') isso vira uma violação no console. Sem JIT, o schema
// continua igual, só um pouco mais lento (irrelevante para 5 campos).
z.config({ jitless: true })

// Schema único, usado tanto no formulário (cliente) quanto na
// revalidação do Worker (servidor) — nunca duplicar estas regras.
// .strict() rejeita campo desconhecido em vez de descartá-lo em silêncio.
export const contatoSchema = z
  .object({
    nome: z.string().min(2, 'Enter at least 2 characters.').max(80, 'Maximum 80 characters.'),
    email: z.email('Enter a valid email address.').max(200, 'Maximum 200 characters.'),
    mensagem: z
      .string()
      .min(20, 'Write at least 20 characters.')
      .max(2000, 'Maximum 2000 characters.'),
    // honeypot: campo que um visitante real nunca preenche.
    empresa: z.literal('', 'Invalid field.'),
    // Token do Cloudflare Turnstile; o Worker o verifica no servidor.
    'cf-turnstile-response': z.string().min(1, 'Complete the verification and try again.'),
  })
  .strict()

export type ContatoInput = z.infer<typeof contatoSchema>
