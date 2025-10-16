import type { RecoverPasswordSchema } from "../schemas/forgot-password.schema";
import type { LoginSchema } from "../schemas/login.schema";
import type { ResetPasswordSchema } from "../schemas/reset-password.schema";
import api from "./api";
import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";

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
      const response = await api.post("cadastro/completar", data);

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
  async login(data: LoginSchema) {
    try {
      const response = await api.post("auth/login", data);
      console.log("Login realizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return Promise.reject(error.response?.data);
      } else {
        return Promise.reject(new Error("Erro inesperado durante o login"));
      }
    }
  },

  async getProfile() {
    try {
      const response = await api.get("profile/me");
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return Promise.reject(error.response?.data);
      } else {
        return Promise.reject(new Error("Erro inesperado ao buscar o perfil do usuário"));
      }
    }
  },
  editProfile(data: Partial<CadastroUsuarioData>) {
    return api.put("profile/me", data)
      .then(response => response.data)
      .catch(error => {
        if (isAxiosError(error)) {
          return Promise.reject(error.response?.data);
        } else {
          return Promise.reject(new Error("Erro inesperado ao editar o perfil do usuário"));
        }
      });
  },
  isLoggedIn() {
    if (typeof window === "undefined") {
      return false; // SSR sempre retorna false
    }
    const token = sessionStorage.getItem("auth_token") || Cookies.get("token");
    return !!token;
  },
  logout() {
    sessionStorage.removeItem("auth_token");
    Cookies.remove("token");

  },
  async recoverPasswordRequest(data: RecoverPasswordSchema) {
    try {
      const response = await api.post("api/recuperacao/password/request-link", data); 
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return Promise.reject(error.response?.data);
      } else {
        return Promise.reject(new Error("Erro inesperado durante a recuperação de senha"));
      }
    }
  },
  async validateRecoverPasswordToken(token: string) {
    try {
      const response = await api.get("api/recuperacao/password/validate-token",{
        params: { token }
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return Promise.reject(error.response?.data);
      } else {
        return Promise.reject(new Error("Erro inesperado durante a recuperação de senha"));
      }
    }
  },
  async resetPasswordWithToken(data: ResetPasswordSchema, token: string) {
    try {
      const response = await api.post("api/recuperacao/password/reset-with-token", {...data, token});
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return Promise.reject(error.response?.data);
      } else {
        return Promise.reject(new Error("Erro inesperado durante a redefinição de senha"));
      }
    }
  }
};

export default userService;
