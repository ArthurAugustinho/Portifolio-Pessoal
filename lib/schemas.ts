import { z } from 'zod'

// Schema único, usado tanto no formulário (cliente) quanto na
// revalidação da API (servidor) — nunca duplicar estas regras.
export const contatoSchema = z.object({
  nome: z.string().min(2, 'Enter at least 2 characters.').max(80, 'Maximum 80 characters.'),
  email: z.email('Enter a valid email address.'),
  mensagem: z
    .string()
    .min(20, 'Write at least 20 characters.')
    .max(2000, 'Maximum 2000 characters.'),
  // honeypot: campo que um visitante real nunca preenche.
  empresa: z.literal('', 'Invalid field.'),
})

export type ContatoInput = z.infer<typeof contatoSchema>
