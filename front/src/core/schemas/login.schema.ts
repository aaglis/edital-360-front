import { z } from "zod";

function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

export const loginSchema = z.object({
  cpf: z.string().min(11, "CPF obrigatório").max(14, "CPF inválido").refine((cpf) => validarCPF(cpf), {
    message: "CPF inválido",
  }),
  password: z.string().min(6, "Senha muito curta"),
  recaptchaResponse: z.string().min(1, "Verifique o reCAPTCHA"),

});

export type LoginSchema = z.infer<typeof loginSchema>;