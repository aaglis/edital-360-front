import api from './api';

export interface PedidoIsencaoResponse {
  success: boolean;
  message?: string;
}

export const pedidoIsencaoService = {
  async solicitar(noticeId: string, arquivos: File[]): Promise<PedidoIsencaoResponse> {
    try {
      console.log(`📤 Enviando pedido de isenção para edital: ${noticeId}`);
      console.log(`📎 Arquivos: ${arquivos.length} arquivo(s)`);
      
      const formData = new FormData();
      
      // Adicionar cada arquivo individualmente
      arquivos.forEach((arquivo, index) => {
        formData.append(`arquivos[${index}]`, arquivo);
      });

      // Log dos arquivos
      arquivos.forEach((arquivo, index) => {
        console.log(`  📄 Arquivo ${index + 1}: ${arquivo.name} (${arquivo.size} bytes)`);
      });
      
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
          return {
            success: false,
            message: String(axiosError.response.data.message)
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