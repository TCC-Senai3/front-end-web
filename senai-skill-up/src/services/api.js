import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000', // Atualize com a URL do seu backend
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Criar instância do Axios com configuração padrão
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros global
    if (error.response) {
      // Erros 4xx/5xx
      console.error('Erro na resposta da API:', error.response.status, error.response.data);
      
      // Tratamento para token expirado
      if (error.response.status === 401) {
        // Redirecionar para login ou renovar token
        console.warn('Sessão expirada. Redirecionando para login...');
        // Remover token inválido
        localStorage.removeItem('token');
        // Redirecionar para a página de login
        window.location.href = '/login';
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
