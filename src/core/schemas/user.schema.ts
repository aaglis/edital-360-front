import { z } from "zod";

export const editUserSchema = z.object({
  escolaridade: z.enum([
    "FUNDAMENTAL_INCOMPLETO",
    "FUNDAMENTAL_COMPLETO",
    "MEDIO_INCOMPLETO",
    "MEDIO_COMPLETO",
    "SUPERIOR_INCOMPLETO",
    "SUPERIOR_COMPLETO",
    "POS_GRADUACAO",
    "MESTRADO",
    "DOUTORADO",
  ]).optional(),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido").optional(),
  uf: z.string().min(2, "UF inválido").max(2, "UF inválido").optional(),
  cidade: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres.").optional(),
  bairro: z.string().min(2, "O bairro deve ter pelo menos 2 caracteres.").optional(),
  logradouro: z.string().min(2, "O logradouro deve ter pelo menos 2 caracteres.").optional(),
  complemento: z.string().optional(),
  numeroCasa: z.string().min(1, "O número da casa é obrigatório.").optional(),
  telefoneNumero: z.string().min(8, "Número de telefone inválido").max(9, "Número de telefone inválido"),
  telefoneDdd: z.string().min(2, "DDD inválido").max(3, "DDD inválido"),
  celularDdd: z.string().min(2, "DDD inválido").max(3, "DDD inválido"),
  celularNumero: z.string().min(8, "Número de celular inválido").max(9, "Número de celular inválido"),
  email: z.string().email("Email inválido."),
});