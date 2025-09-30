export interface EditalRequest {
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
  pdfUrl: string;
  schedule?: {
    description: string;
    date: string;
  }[];
  vacancies: number;
}