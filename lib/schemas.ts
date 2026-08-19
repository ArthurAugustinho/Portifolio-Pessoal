import { z } from 'zod'

// Schema único, usado tanto no formulário (cliente) quanto na
// revalidação da API (servidor) — nunca duplicar estas regras.
export const contatoSchema = z.object({
  nome: z.string().min(2, 'Digite pelo menos 2 caracteres.').max(80, 'Máximo de 80 caracteres.'),
  email: z.email('Digite um email válido.'),
  mensagem: z
    .string()
    .min(20, 'Escreva pelo menos 20 caracteres.')
    .max(2000, 'Máximo de 2000 caracteres.'),
  // honeypot: campo que um visitante real nunca preenche.
  empresa: z.literal('', 'Campo inválido.'),
})

export type ContatoInput = z.infer<typeof contatoSchema>
