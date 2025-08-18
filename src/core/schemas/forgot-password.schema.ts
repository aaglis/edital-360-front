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

export const recoverPasswordSchema = z.object({
  cpf: z.string().min(11, "Informe um CPF válido").refine((cpf) => validarCPF(cpf), {
    message: "CPF inválido",
  }),
  channel: z.enum(["EMAIL", "SMS"], { error: "Selecione um canal" }),
  recaptchaToken: z.string().min(1, "Confirme o reCAPTCHA"),
});

export type RecoverPasswordSchema = z.infer<typeof recoverPasswordSchema>;