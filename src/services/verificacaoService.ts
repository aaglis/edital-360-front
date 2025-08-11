import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface VerificarCadastroData {
  cpf: string;
  cep: string;
}

export interface VerificarCadastroResponse {
  success: boolean;
  message: string;
  data?: {
    cpfValido: boolean;
    cepValido: boolean;
    endereco?: {
      logradouro: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  };
}

export const verificacaoService = {
  async verificarCadastro(data: VerificarCadastroData): Promise<VerificarCadastroResponse> {
    try {
      // GET com query parameters em vez de POST
      const cpfLimpo = data.cpf.replace(/\D/g, "");
      const cepLimpo = data.cep.replace(/\D/g, "");
      
      const response = await axios.get(`${API_BASE_URL}cadastro/verificar`, {
        params: {
          cpf: cpfLimpo,
          cep: cepLimpo,
        },
      });

      // Trata a resposta da API que retorna string em vez de objeto
      let responseData;
      
      if (typeof response.data === 'string') {
        // Se a API retorna string "CPF e CEP válidos."
        if (response.data.includes('válidos') || response.data.includes('válido')) {
          responseData = {
            cpfValido: true,
            cepValido: true,
            endereco: null, // API não retorna endereço por enquanto
          };
        } else {
          responseData = {
            cpfValido: false,
            cepValido: false,
            endereco: null,
          };
        }
      } else {
        // Se a API retorna objeto estruturado
        responseData = response.data;
      }

      return {
        success: true,
        message: "Verificação realizada com sucesso",
        data: responseData,
      };
    } catch (error: unknown) {
      console.error("Erro ao verificar cadastro:", error);
      
      if (axios.isAxiosError(error)) {
        // Erro 403 - Forbidden 
        if (error.response?.status === 403) {
          return {
            success: false,
            message: "Erro de autorização - usando validação local",
          };
        }
        
        // Outros erros da API
        if (error.response?.data?.message) {
          return {
            success: false,
            message: error.response.data.message,
          };
        }
      }
      
      return {
        success: false,
        message: "Erro ao verificar dados - usando validação local",
      };
    }
  },
};
