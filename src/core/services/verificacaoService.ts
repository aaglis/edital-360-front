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
     
      const cpfLimpo = data.cpf.replace(/\D/g, "");
      const cepLimpo = data.cep.replace(/\D/g, "");
      
      const response = await axios.get(`${API_BASE_URL}cadastro/verificar`, {
        params: {
          cpf: cpfLimpo,
          cep: cepLimpo,
        },
      });

      
      let responseData;
      
      if (typeof response.data === 'string') {
        
        if (response.data.includes('válidos') || response.data.includes('válido')) {
          responseData = {
            cpfValido: true,
            cepValido: true,
            endereco: null, 
          };
        } else {
          responseData = {
            cpfValido: false,
            cepValido: false,
            endereco: null,
          };
        }
      } else {
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
        if (error.response?.status === 403) {
          return {
            success: false,
            message: "Erro de autorização - usando validação local",
          };
        }
        
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
