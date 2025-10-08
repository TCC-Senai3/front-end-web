// Serviço de API centralizado para comunicação com backend Java
import axios from 'axios';

// Configuração da API
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor - Adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Obter token do sessionStorage (mantido apenas para autenticação)
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Tratamento global de respostas e erros
api.interceptors.response.use(
  (response) => {
    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Tratamento de erro 401 (Unauthorized) - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Limpar dados de autenticação
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');

      // Redirecionar para login se não estiver lá
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(new Error('Sessão expirada. Faça login novamente.'));
    }

    // Tratamento de erro 403 (Forbidden)
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Acesso negado. Você não tem permissão para esta ação.'));
    }

    // Tratamento de erro 404 (Not Found)
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Recurso não encontrado.'));
    }

    // Tratamento de erro 422 (Unprocessable Entity) - Validação
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.errors || {};
      return Promise.reject({
        message: 'Dados inválidos',
        validationErrors,
        status: 422
      });
    }

    // Tratamento de erro 500 (Internal Server Error)
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Erro interno do servidor. Tente novamente mais tarde.'));
    }

    // Tratamento de erro de rede
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet e tente novamente.'));
    }

    // Log detalhado para debug
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    return Promise.reject(error);
  }
);

// Classe para gerenciar chamadas de API com retry e cache
class ApiService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Método genérico para fazer requisições com retry automático
  async request(config, options = {}) {
    const {
      retries = API_CONFIG.RETRY_ATTEMPTS,
      retryDelay = API_CONFIG.RETRY_DELAY,
      useCache = false,
      cacheKey = null,
      cacheTTL = 300000 // 5 minutos
    } = options;

    // Verificar cache se habilitado
    if (useCache && cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Evitar requests duplicados
    const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.data || config.params || {})}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    const executeRequest = async (attempt = 1) => {
      try {
        const promise = api.request(config);
        this.pendingRequests.set(requestKey, promise);

        const response = await promise;

        // Armazenar no cache se habilitado
        if (useCache && cacheKey) {
          this.setCache(cacheKey, response, cacheTTL);
        }

        return response;

      } catch (error) {
        // Remover da lista de pending
        this.pendingRequests.delete(requestKey);

        // Tentar novamente se há tentativas restantes
        if (attempt < retries) {
          console.warn(`🔄 Tentativa ${attempt}/${retries} falhou. Tentando novamente em ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          return executeRequest(attempt + 1);
        }

        throw error;
      }
    };

    try {
      const result = await executeRequest();

      // Remover da lista de pending se sucesso
      this.pendingRequests.delete(requestKey);

      return result;

    } catch (error) {
      // Remover da lista de pending se erro final
      this.pendingRequests.delete(requestKey);
      throw error;
    }
  }

  // Método GET
  async get(url, params = {}, options = {}) {
    return this.request({
      method: 'GET',
      url,
      params
    }, options);
  }

  // Método POST
  async post(url, data = {}, options = {}) {
    return this.request({
      method: 'POST',
      url,
      data
    }, options);
  }

  // Método PUT
  async put(url, data = {}, options = {}) {
    return this.request({
      method: 'PUT',
      url,
      data
    }, options);
  }

// Método PATCH
  async patch(url, data = {}, options = {}) {
    return this.request({
      method: 'PATCH',
      url,
      data
    }, options);
  }

  // Método DELETE
  async delete(url, options = {}) {
    return this.request({
      method: 'DELETE',
      url
    }, options);
  }

  // Gerenciamento de cache
  setCache(key, data, ttl = 300000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Utilitário para upload de arquivos
  async uploadFile(url, file, fieldName = 'file', additionalData = {}) {
    const formData = new FormData();
    formData.append(fieldName, file);

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Utilitário para download de arquivos
  async downloadFile(url, filename, params = {}) {
    try {
      const response = await this.request({
        method: 'GET',
        url,
        params,
        responseType: 'blob',
      });

      // Criar link para download
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error('Erro no download:', error);
      throw error;
    }
  }
}

// Instância singleton
const apiService = new ApiService();

// Exportar tanto a instância configurada quanto a classe para casos especiais
export default apiService;
export { api, API_CONFIG };
export { ApiService };
