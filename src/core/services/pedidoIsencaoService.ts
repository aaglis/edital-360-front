import api from './api';

export interface PedidoIsencaoResponse {
  success: boolean;
  message?: string;
}

export interface PedidoIsencaoStatus {
  id: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  enviadoEm: string;
  revisadoEm?: string;
  comentarioRevisor?: string;
}

export interface VerificarPedidoResponse {
  success: boolean;
  data?: PedidoIsencaoStatus;
  message?: string;
}

export const pedidoIsencaoService = {
  async verificarPedidoExistente(noticeId: string): Promise<VerificarPedidoResponse> {
    try {
      console.log(`🔍 Verificando pedido de isenção existente para edital: ${noticeId}`);
      
      const response = await api.get(`/pedidos-isencao/editais/${noticeId}/meu-pedido`);
      
      console.log('✅ Pedido encontrado:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        
        if (axiosError.response?.status === 404) {
          // Não há pedido existente - isso é normal
          return {
            success: false,
            message: 'Nenhum pedido encontrado'
          };
        }
      }
      
      console.error('❌ Erro ao verificar pedido existente:', error);
      return {
        success: false,
        message: 'Erro ao verificar pedido existente'
      };
    }
  },

  async solicitar(noticeId: string, arquivos: File[]): Promise<PedidoIsencaoResponse> {
    try {
      console.log(`📤 Enviando pedido de isenção para edital: ${noticeId}`);
      console.log(`📎 Arquivos: ${arquivos.length} arquivo(s)`);
      
      // Verificar se há token de autenticação
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
      if (!token) {
        return {
          success: false,
          message: 'Você precisa estar logado para solicitar isenção'
        };
      }
      
      const formData = new FormData();
      
      // Adicionar cada arquivo com o nome correto que a API espera
      arquivos.forEach((arquivo) => {
        formData.append('arquivos', arquivo);
      });

      // Log dos arquivos
      arquivos.forEach((arquivo, index) => {
        console.log(`  📄 Arquivo ${index + 1}: ${arquivo.name} (${arquivo.size} bytes)`);
      });
      
      console.log('📦 FormData preparado com', arquivos.length, 'arquivo(s)');
      
      const response = await api.post(`/pedidos-isencao/editais/${noticeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Pedido de isenção enviado com sucesso:', response.data);
      
      return {
        success: true,
        message: 'Pedido de isenção enviado com sucesso!'
      };
    } catch (error: unknown) {
      console.error('❌ Erro ao enviar pedido de isenção:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: Record<string, unknown>; status?: number } };
        
        // Log detalhado do erro da API
        if (axiosError.response) {
          console.error('📋 Resposta da API:', axiosError.response.data);
          console.error('📊 Status:', axiosError.response.status);
        }
        
        if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          const errorMessage = String(axiosError.response.data.message);
          
          // Verificar se é erro de pedido duplicado
          if (errorMessage.includes('duplicate key value violates unique constraint') || 
              errorMessage.includes('ukq386ysw0buhhv7t84tiyyqtc4') ||
              errorMessage.includes('already exists')) {
            return {
              success: false,
              message: 'Você já possui um pedido de isenção para este edital. Cada usuário pode fazer apenas um pedido por edital.'
            };
          }
          
          return {
            success: false,
            message: errorMessage
          };
        }
        
        if (axiosError.response?.status === 400) {
          return {
            success: false,
            message: 'Dados inválidos. Verifique os arquivos enviados.'
          };
        }
        
        if (axiosError.response?.status === 404) {
          return {
            success: false,
            message: 'Edital não encontrado'
          };
        }
        
        if (axiosError.response?.status === 413) {
          return {
            success: false,
            message: 'Arquivos muito grandes. Reduza o tamanho e tente novamente.'
          };
        }
      }
      
      return {
        success: false,
        message: 'Erro ao enviar pedido de isenção. Verifique sua conexão e tente novamente.'
      };
    }
  }
};