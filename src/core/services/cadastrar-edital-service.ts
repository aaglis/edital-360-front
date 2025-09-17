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
    exam: "OBJETIVA" | "DISCURSIVA";
  }>;
  roles: Array<{
    role: string;
    vacancies: number;
  }>;
  requirements: {
    requirementType: "ENSINO_MEDIO_COMPLETO" | "FUNDAMENTAL_INCOMPLETO" | "FUNDAMENTAL_COMPLETO" | "MEDIO_INCOMPLETO" | "MEDIO_COMPLETO" | "SUPERIOR_INCOMPLETO" | "SUPERIOR_COMPLETO" | "POS_GRADUACAO" | "MESTRADO" | "DOUTORADO";
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


type ExamType = "OBJETIVA" | "DISCURSIVA";
type RequirementType = "ENSINO_MEDIO_COMPLETO" | "FUNDAMENTAL_INCOMPLETO" | "FUNDAMENTAL_COMPLETO" | "MEDIO_INCOMPLETO" | "MEDIO_COMPLETO" | "SUPERIOR_INCOMPLETO" | "SUPERIOR_COMPLETO" | "POS_GRADUACAO" | "MESTRADO" | "DOUTORADO";


const tipoProvaMap: Record<string, ExamType> = {
  "objetiva": "OBJETIVA",
  "discursiva": "DISCURSIVA",
  "testes_fisicos": "OBJETIVA", // API não aceita TESTES_FISICOS, mapeando para OBJETIVA
  "psicologicos": "OBJETIVA", // API não aceita PSICOLOGICOS, mapeando para OBJETIVA
  "pericias": "OBJETIVA", // API não aceita PERICIAS, mapeando para OBJETIVA
  "entrevistas": "OBJETIVA" // API não aceita ENTREVISTAS, mapeando para OBJETIVA
};


const escolaridadeMap: Record<string, RequirementType> = {
  "fundamental_incompleto": "FUNDAMENTAL_INCOMPLETO",
  "fundamental_completo": "FUNDAMENTAL_COMPLETO",
  "medio_incompleto": "MEDIO_INCOMPLETO",
  "medio_completo": "ENSINO_MEDIO_COMPLETO",
  "superior_incompleto": "SUPERIOR_INCOMPLETO",
  "superior_completo": "SUPERIOR_COMPLETO",
  "pos_graduacao": "POS_GRADUACAO",
  "mestrado": "MESTRADO",
  "doutorado": "DOUTORADO",
};

export const cadastrarEditalService = {
  async cadastrar(data: CadastrarEditalSchema): Promise<CadastrarEditalResponse> {
    try {
      console.log("📤 Dados recebidos do formulário:", data);
      
      const payload: CadastrarEditalRequest = {
        title: data.titulo,
        description: data.descricao,
        remuneration: data.taxaInscricao || 0,
        initialDate: data.dataInicioInscricoes.toISOString().split('T')[0],
        endDate: data.dataFimInscricoes.toISOString().split('T')[0],
        examDate: data.dataProva.toISOString().split('T')[0],
        
        phases: data.tipoProva && data.tipoProva.length > 0 ? data.tipoProva.map((tipo: string, index: number) => ({
          order: index,
          exam: tipoProvaMap[tipo] || "OBJETIVA"
        })) : [{
          order: 0,
          exam: "OBJETIVA" as const
        }],
        
        roles: data.cargos && data.cargos.length > 0 ? data.cargos.map((cargo) => ({
          role: cargo.nomeCargo,
          vacancies: cargo.numeroVagas
        })) : [],
        
        requirements: {
          requirementType: escolaridadeMap[data.escolaridadeMinima] || "ENSINO_MEDIO_COMPLETO",
          minimumAge: data.idadeMinima || undefined,
          maximumAge: data.idadeMaxima || undefined
        },
        
        documents: data.documentosExigidos && data.documentosExigidos.length > 0 
          ? data.documentosExigidos.filter((doc: string) => doc.trim() !== "") 
          : [],
        
        quotas: data.cotas ? {
          vagasPcd: data.cotas.pcd || 0,
          vagasNegros: data.cotas.negros || 0,
          vagasIndigenas: data.cotas.indigenas || 0,
          outrasCotas: data.cotas.outras || undefined
        } : undefined,
        
        subscription: data.taxaInscricao || 0,
        
        pdf: data.arquivoEdital,
        
        schedule: data.cronograma && data.cronograma.length > 0 ? data.cronograma.map((item) => ({
          description: item.evento,
          date: new Date(item.data).toISOString()
        })).filter(item => item.description && item.description.trim() !== "") : undefined
      };

      console.log("📋 Payload preparado para API:", payload);

      const formData = new FormData();
      
      console.log("📄 Payload completo:", payload);
      console.log("📎 PDF File:", payload.pdf);
      
      // Validação do PDF
      if (!payload.pdf || !(payload.pdf instanceof File)) {
        throw new Error("Arquivo PDF é obrigatório");
      }
      
      if (payload.pdf.type !== 'application/pdf') {
        throw new Error("Apenas arquivos PDF são aceitos");
      }
      
      if (payload.pdf.size > 10 * 1024 * 1024) { // 10MB
        throw new Error("Arquivo PDF deve ter no máximo 10MB");
      }
      
      // Adicionar campos simples
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('remuneration', payload.remuneration?.toString() || '0');
      formData.append('initialDate', payload.initialDate);
      formData.append('endDate', payload.endDate);
      formData.append('examDate', payload.examDate);
      formData.append('subscription', payload.subscription.toString());
      
      // Adicionar phases individualmente
      payload.phases.forEach((phase, index) => {
        formData.append(`phases[${index}].order`, phase.order.toString());
        formData.append(`phases[${index}].exam`, phase.exam);
      });
      
      // Adicionar roles individualmente
      payload.roles.forEach((role, index) => {
        formData.append(`roles[${index}].role`, role.role);
        formData.append(`roles[${index}].vacancies`, role.vacancies.toString());
      });
      
      // Adicionar requirements
      formData.append('requirements.requirementType', payload.requirements.requirementType);
      if (payload.requirements.minimumAge !== undefined) {
        formData.append('requirements.minimumAge', payload.requirements.minimumAge.toString());
      }
      if (payload.requirements.maximumAge !== undefined) {
        formData.append('requirements.maximumAge', payload.requirements.maximumAge.toString());
      }
      
      // Adicionar documents individualmente
      payload.documents.forEach((document, index) => {
        formData.append(`documents[${index}]`, document);
      });
      
      // Adicionar quotas (se existir)
      if (payload.quotas) {
        formData.append('quotas.vagasPcd', payload.quotas.vagasPcd.toString());
        formData.append('quotas.vagasNegros', payload.quotas.vagasNegros.toString());
        formData.append('quotas.vagasIndigenas', payload.quotas.vagasIndigenas.toString());
        if (payload.quotas.outrasCotas) {
          formData.append('quotas.outrasCotas', payload.quotas.outrasCotas);
        }
      }
      
      // Adicionar schedule (se existir)
      if (payload.schedule) {
        payload.schedule.forEach((item, index) => {
          formData.append(`schedule[${index}].description`, item.description);
          // Converter data para formato LocalDateTime sem timezone
          const date = new Date(item.date);
          const formattedDate = date.toISOString().replace('Z', '');
          formData.append(`schedule[${index}].date`, formattedDate);
        });
      }
      
      // Adicionar o arquivo PDF
      formData.append('pdf', payload.pdf, payload.pdf.name);
      
      console.log("📤 Enviando requisição para:", `${process.env.NEXT_PUBLIC_API_URL}/editais/cadastrar`);
      console.log("📦 FormData criado com campos individuais para Spring Boot");
      
      // Debug do FormData
      console.log("🔍 Campos do FormData:");
      console.log("  - title:", payload.title);
      console.log("  - description:", payload.description);
      console.log("  - phases:", payload.phases.length, "items");
      console.log("  - roles:", payload.roles.length, "items");
      console.log("  - documents:", payload.documents.length, "items");
      
      const response = await api.post('/editais/cadastrar', formData, {
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
        const axiosError = error as { response?: { data?: Record<string, unknown>; status?: number } };
        
        // Log detalhado do erro da API
        if (axiosError.response) {
          console.error('📋 Resposta da API:', axiosError.response.data);
          console.error('📊 Status:', axiosError.response.status);
          console.error('📄 Headers:', axiosError.response);
        }
        
        if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          return {
            success: false,
            message: String(axiosError.response.data.message)
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
