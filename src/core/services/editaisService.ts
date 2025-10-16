import api from './api';

export type StatusNotice = 
  | 'PUBLICADO'
  | 'PEDIDO_ISENCAO' 
  | 'EM_ANALISE'
  | 'INSCRICOES_ABERTAS'
  | 'INSCRICOES_ENCERRADAS'
  | 'RESULTADO_PRELIMINAR'
  | 'RESULTADO_FINAL'
  | 'ENCERRADO'
  | 'CANCELADO';

export interface Edital {
  id: string;
  title: string;
  description: string;
  remuneration: number;
  initialDate: string;
  endDate: string;
  createdAt: string;
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
    minimumAge: number;
    maximumAge: number;
  };
  documents: string[];
  quotas: {
    vagasPcd: number;
    vagasNegros: number;
    vagasIndigenas: number;
    outrasCotas: string;
  };
  subscription: number;
  pdfUrl: string;
  schedule: Array<{
    description: string;
    date: string;
  }>;
  vacancies: number;
  exemption: {
    exemptionStartDate: string;
    exemptionEndDate: string;
    eligibleCategories: string[];
    documentationDescription: string;
  };
  statusNotice: StatusNotice;
}

export interface PageableResponse {
  content: Edital[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export interface EditaisParams {
  statusNotice?: StatusNotice;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EditaisResponse {
  success: boolean;
  data?: PageableResponse;
  message?: string;
}

export const editaisService = {
  async obterEditais(params: EditaisParams = {}): Promise<EditaisResponse> {
    try {
      const {
        statusNotice = 'PUBLICADO',
        page = 0,
        size = 10,
        sort = 'initialDate,desc'
      } = params;

      console.log('🔍 Buscando editais com parâmetros:', { statusNotice, page, size, sort });

      const response = await api.get('/editais/obter', {
        params: {
          statusNotice,
          page,
          size,
          sort
        }
      });

      console.log('✅ Editais carregados:', response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      console.error('❌ Erro ao buscar editais:', error);
      
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
            message: 'Nenhum edital encontrado'
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
        message: 'Erro ao carregar editais. Verifique sua conexão e tente novamente.'
      };
    }
  }
};