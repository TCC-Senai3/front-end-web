import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080', // Atualize com a URL do seu backend
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
    // CORREÇÃO APLICADA AQUI:
    // Buscar o token do 'sessionStorage' com a chave 'authToken'
    const token = sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas (SEU CÓDIGO AQUI JÁ ESTÁ MUITO BOM)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.status, error.response.data);
      
      // Tratamento para token expirado ou inválido (Unauthorized)
      if (error.response.status === 401) {
        console.warn('Sessão expirada ou inválida. Redirecionando para login...');
        
        // Limpa o storage
        sessionStorage.removeItem('authToken'); // Use sessionStorage aqui também
        
        // Redireciona para a página de login para evitar loops
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
    } else {
      console.error('Erro ao configurar requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;