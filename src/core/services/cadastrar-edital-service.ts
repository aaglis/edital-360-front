import api from "./api";
import { CadastrarEditalSchema } from "../schemas/cadastrar-edital.schema";

export interface CadastrarEditalRequest {
  title: string;
  description: string;
  remuneration?: number;
  initialDate: string; 
  endDate: string; 
  examDate: string; 
  phases: Array<{
    order: number;
    exam: "OBJETIVA" | "DISCURSIVA" | "TESTES_FISICOS" | "PSICOLOGICOS" | "PERICIAS" | "ENTREVISTAS";
  }>;
  roles: Array<{
    role: string;
    vacancies: number;
  }>;
  requirements: {
    requirementType: "FUNDAMENTAL_INCOMPLETO" | "FUNDAMENTAL_COMPLETO" | "MEDIO_INCOMPLETO" | "MEDIO_COMPLETO" | "SUPERIOR_INCOMPLETO" | "SUPERIOR_COMPLETO" | "POS_GRADUACAO" | "MESTRADO" | "DOUTORADO";
    minimumAge?: number;
    maximumAge?: number;
  };
  documents: string[];
  quotas?: {
    vagasPcd: number;
    vagasNegros: number;
    vagasIndigenas: number;
    outrasCotas?: string;
  };
  subscription: number;
  pdf: File; 
  schedule?: Array<{
    description: string;
    date: string; 
  }>;
}

export interface CadastrarEditalResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}


type ExamType = "OBJETIVA" | "DISCURSIVA" | "TESTES_FISICOS" | "PSICOLOGICOS" | "PERICIAS" | "ENTREVISTAS";
type RequirementType = "FUNDAMENTAL_INCOMPLETO" | "FUNDAMENTAL_COMPLETO" | "MEDIO_INCOMPLETO" | "MEDIO_COMPLETO" | "SUPERIOR_INCOMPLETO" | "SUPERIOR_COMPLETO" | "POS_GRADUACAO" | "MESTRADO" | "DOUTORADO";


const tipoProvaMap: Record<string, ExamType> = {
  "objetiva": "OBJETIVA",
  "discursiva": "DISCURSIVA",
  "testes_fisicos": "TESTES_FISICOS",
  "psicologicos": "PSICOLOGICOS",
  "pericias": "PERICIAS",
  "entrevistas": "ENTREVISTAS"
};


const escolaridadeMap: Record<string, RequirementType> = {
  "fundamental_incompleto": "FUNDAMENTAL_INCOMPLETO",
  "fundamental_completo": "FUNDAMENTAL_COMPLETO",
  "medio_incompleto": "MEDIO_INCOMPLETO",
  "medio_completo": "MEDIO_COMPLETO",
  "superior_incompleto": "SUPERIOR_INCOMPLETO",
  "superior_completo": "SUPERIOR_COMPLETO",
  "pos_graduacao": "POS_GRADUACAO",
  "mestrado": "MESTRADO",
  "doutorado": "DOUTORADO",
};

export const cadastrarEditalService = {
  async cadastrar(data: CadastrarEditalSchema): Promise<CadastrarEditalResponse> {
    try {
      const payload: CadastrarEditalRequest = {
        title: data.titulo,
        description: data.descricao,
        remuneration: data.taxaInscricao || 0,
        initialDate: data.dataInicioInscricoes.toISOString().split('T')[0],
        endDate: data.dataFimInscricoes.toISOString().split('T')[0],
        examDate: data.dataProva.toISOString().split('T')[0],
        
        phases: data.tipoProva.map((tipo: string, index: number) => ({
          order: index,
          exam: tipoProvaMap[tipo] || tipo.toUpperCase()
        })),
        
        roles: data.cargos.map((cargo) => ({
          role: cargo.nomeCargo,
          vacancies: cargo.numeroVagas
        })),
        
        requirements: {
          requirementType: escolaridadeMap[data.escolaridadeMinima] || data.escolaridadeMinima.toUpperCase(),
          minimumAge: data.idadeMinima || undefined,
          maximumAge: data.idadeMaxima || undefined
        },
        
        documents: data.documentosExigidos.filter((doc: string) => doc.trim() !== ""),
        
        quotas: data.cotas ? {
          vagasPcd: data.cotas.pcd || 0,
          vagasNegros: data.cotas.negros || 0,
          vagasIndigenas: data.cotas.indigenas || 0,
          outrasCotas: data.cotas.outras || undefined
        } : undefined,
        
        subscription: data.taxaInscricao || 0,
        
        pdf: data.arquivoEdital,
        
        schedule: data.cronograma?.map((item) => ({
          description: item.evento,
          date: new Date(item.data).toISOString()
        })) || undefined
      };

      const formData = new FormData();
      
      const { pdf, ...jsonPayload } = payload;
      formData.append('edital', JSON.stringify(jsonPayload));
      formData.append('pdf', pdf);
      
      const response = await api.post('editais/cadastrar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        message: 'Edital cadastrado com sucesso!',
        data: response.data
      };
      
    } catch (error: unknown) {
      console.error('Erro ao cadastrar edital:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        
        if (axiosError.response?.data?.message) {
          return {
            success: false,
            message: axiosError.response.data.message
          };
        }
        
        if (axiosError.response?.status === 400) {
          return {
            success: false,
            message: 'Dados inválidos. Verifique as informações e tente novamente.'
          };
        }
        
        if (axiosError.response?.status === 401) {
          return {
            success: false,
            message: 'Sessão expirada. Faça login novamente.'
          };
        }
        
        if (axiosError.response?.status === 403) {
          return {
            success: false,
            message: 'Você não tem permissão para cadastrar editais.'
          };
        }
        
        if (axiosError.response?.status && axiosError.response.status >= 500) {
          return {
            success: false,
            message: 'Erro interno do servidor. Tente novamente mais tarde.'
          };
        }
      }
      
      return {
        success: false,
        message: 'Erro inesperado ao cadastrar edital. Tente novamente.'
      };
    }
  }
};
