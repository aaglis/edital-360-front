import { z } from "zod";

export const loginSchema = z.object({
  cpf: z.string().min(11, "CPF obrigatório").max(14, "CPF inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export type LoginSchema = z.infer<typeof loginSchema>;