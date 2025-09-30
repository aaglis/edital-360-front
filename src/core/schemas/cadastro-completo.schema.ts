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

export const cadastroCompletoSchema = z
  .object({
    nome: z.string().min(2, "Nome obrigatório"),
    dataNascimento: z.string().min(10, "Data de nascimento obrigatória"),
    sexo: z.enum(["MASCULINO", "FEMININO"], {
      message: "Selecione o sexo",
    }),
    nomePai: z.string().min(2, "Nome do pai obrigatório"),
    nomeMae: z.string().min(2, "Nome da mãe obrigatório"),

    escolaridade: z.enum(
      [
        "FUNDAMENTAL_INCOMPLETO",
        "FUNDAMENTAL_COMPLETO", 
        "MEDIO_INCOMPLETO",
        "MEDIO_COMPLETO",
        "SUPERIOR_INCOMPLETO",
        "SUPERIOR_COMPLETO",
        "POS_GRADUACAO",
        "MESTRADO",
        "DOUTORADO",
      ],
      {
        message: "Selecione a escolaridade",
      }
    ),

    cpf: z
      .string()
      .min(14, "CPF obrigatório")
      .max(14, "CPF inválido")
      .refine((cpf) => validarCPF(cpf), {
        message: "CPF inválido",
      }),
    documentoIdentidade: z
      .string()
      .min(5, "Documento de identidade obrigatório")
      .max(12),
    ufIdentidade: z.string().min(2, "UF da identidade obrigatória").max(2),

    cep: z.string().min(9, "CEP obrigatório").max(9),
    uf: z.string().min(2, "UF obrigatória").max(2),
    cidade: z.string().min(2, "Cidade obrigatória"),
    bairro: z.string().min(2, "Bairro obrigatório"),
    logradouro: z.string().min(5, "Logradouro obrigatório"),
    complemento: z.string().optional(),
    numero: z.string().min(1, "Número obrigatório"),

    dddTelefone: z.string().min(2, "DDD obrigatório").max(2),
    telefone: z.string().min(9, "Telefone obrigatório").max(9),
    dddCelular: z.string().min(2, "DDD obrigatório").max(2),
    celular: z.string().min(10, "Celular obrigatório").max(10),
    email: z.string().email({ message: "E-mail inválido" }),
    confirmarEmail: z.string().email({ message: "E-mail inválido" }),

    senha: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .refine((val) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
        message:
          "Senha deve conter ao menos: uma letra maiúscula, uma minúscula e um número",
      }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.email === data.confirmarEmail, {
    message: "E-mails não conferem",
    path: ["confirmarEmail"],
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"],
  });

export type CadastroCompletoSchema = z.infer<typeof cadastroCompletoSchema>;
