import api from "./api";
import axios from "axios";

export interface CadastroUsuarioData {
  cpf: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  nomePai: string;
  nomeMae: string;
  escolaridade: string;
  identidade: string;
  ufIdentidade: string;
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  complemento: string;
  numeroCasa: string;
  telefoneDdd: string;
  telefoneNumero: string;
  celularDdd: string;
  celularNumero: string;
  email: string;
  confirmarEmail: string;
  senha: string;
  confirmarSenha: string;
}

export interface CadastroUsuarioResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const userService = {
  async cadastrar(data: CadastroUsuarioData): Promise<CadastroUsuarioResponse> {
    try {
      const response = await api.post("/cadastro/completar", data);

      return {
        success: true,
        message: "Cadastro realizado com sucesso!",
        data: response.data,
      };
    } catch (error: unknown) {
      console.error("Erro ao cadastrar usuário:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Erro ${error.response?.status}: ${error.response?.statusText}`;

        return {
          success: false,
          message: errorMessage,
        };
      }

      return {
        success: false,
        message: "Erro inesperado. Tente novamente mais tarde.",
      };
    }
  },
};

export default userService;
