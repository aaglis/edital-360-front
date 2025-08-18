import { z } from "zod";

export const resetPasswordSchema = z.object({
  code: z.string().nonempty("O código é obrigatório."),
  channel: z.enum(["EMAIL", "SMS"]),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  confirmarSenha: z.string().nonempty("A confirmação de senha é obrigatória."),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem.",
  path: ["confirmarSenha"],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
