import api from './api';

export interface EditalDetalhes {
  id: string;
  title: string;
  description: string;
  remuneration: number;
  initialDate: string;
  endDate: string;
  examDate: string;
  phases: Array<{
    order: number;
    exam: string;
  }>;
  roles: Array<{
    role: string;
    vacancies: number;
  }>;
  requirements: {
    requirementType: string;
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
  schedule?: Array<{
    description: string;
    date: string;
  }>;
}

export interface EditalDetalhesResponse {
  success: boolean;
  data?: EditalDetalhes;
  message?: string;
}

export const editalDetalhesService = {
  async buscarPorId(id: string): Promise<EditalDetalhesResponse> {
    try {
      console.log(`🔍 Buscando detalhes do edital com ID: ${id}`);
      
      const response = await api.get(`/editais/obter/${id}`);
      
      console.log('✅ Detalhes do edital carregados:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      console.error('❌ Erro ao buscar detalhes do edital:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: Record<string, unknown>; status?: number } };
        
        if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          return {
            success: false,
            message: String(axiosError.response.data.message)
          };
        }
        
        if (axiosError.response?.status === 404) {
          return {
            success: false,
            message: 'Edital não encontrado'
          };
        }
        
        if (axiosError.response?.status === 500) {
          return {
            success: false,
            message: 'Erro interno do servidor. Tente novamente mais tarde.'
          };
        }
      }
      
      return {
        success: false,
        message: 'Erro ao carregar detalhes do edital. Verifique sua conexão e tente novamente.'
      };
    }
  }
};