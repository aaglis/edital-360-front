export interface EditalResponse {
  content: EditalData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

export interface CadastrarEditalRequest {
  title: string;
  description: string;
  remuneration?: number;
  initialDate: string; 
  endDate: string; 
  examDate: string; 
  phases: Array<{
    order: number;
    exam: "OBJETIVA" | "DISCURSIVA" | "TESTE_FISICO" | "TESTE_PSICOLOGICO" | "PERICIAS" | "ENTREVISTAS";
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
  exemption?: {
    exemptionStartDate: string;
    exemptionEndDate: string;
    eligibleCategories: string[];
    documentationDescription: string;
  };
}

export interface CadastrarEditalResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface EditalData {
  id: string;
  title: string;
  description: string;
  remuneration: number;
  initialDate: string;
  endDate: string;
  examDate: string;
  phases: {
    order: number;
    exam: "OBJETIVA" | "DISCURSIVA" | "TESTE_FISICO" | "TESTE_PSICOLOGICO" | "PERICIAS" | "ENTREVISTAS";
  }[];
  roles: {
    role: string;
    vacancies: number;
  }[];
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
  pdf: string;
  schedule?: {
    description: string;
    date: string;
  }[];
  vacancies: number;
  createdAt?: string;
  statusNotice: string;
  exemption?: {
    exemptionStartDate: string;
    exemptionEndDate: string;
    eligibleCategories: string[];
    documentationDescription: string;
  };
}