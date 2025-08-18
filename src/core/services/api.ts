import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
     
      const token = sessionStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error instanceof Error ? error : new Error('Request error'));
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Não autorizado - redirecionando para login');
      } else if (error.response?.status === 500) {
        console.error('Erro interno do servidor');
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error('Response error'));
  }
);

export default api;
