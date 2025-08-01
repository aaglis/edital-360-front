import { z } from "zod";

export const registerSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe seu nome completo"),
  cpf: z.string().min(14, "CPF inválido"),
  cep: z.string().min(9, "CEP inválido"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
