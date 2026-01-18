import axios from "axios";

export const API_CONFIG = {
  BASE_URL: "https://tccdrakes.azurewebsites.net",
  TIMEOUT: 30000, // Aumentando o timeout para 30 segundos
  MAX_RETRIES: 2, // Número máximo de tentativas
  RETRY_DELAY: 1000, // Delay entre tentativas em ms
};

// Criar instância do Axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Função para adicionar delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Configuração de retentativas automáticas
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se for um erro 401 (não autorizado) e não for uma requisição de login
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login')) {
      // Se já tentamos renovar o token uma vez, não tente novamente para evitar loops
      if (originalRequest._retry) {
        // Limpa os dados de autenticação e redireciona para a página de login
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");
        delete api.defaults.headers.common["Authorization"];
        
        // Se estiver no navegador, redireciona para a página de login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
      
      // Marca a requisição como já tentada
      originalRequest._retry = true;
      
      try {
        // Tenta renovar o token (se houver um refresh token)
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/usuarios/refresh-token`, { 
            refreshToken 
          });
          
          const { token } = response.data;
          
          // Atualiza o token no armazenamento local
          sessionStorage.setItem("authToken", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Repete a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          throw new Error("Nenhum refresh token disponível");
        }
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        // Se não conseguir renovar o token, faz logout
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");
        delete api.defaults.headers.common["Authorization"];
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Se for um erro de timeout e ainda não excedeu o número máximo de tentativas
    if (error.code === 'ECONNABORTED' && (!originalRequest._retryCount || originalRequest._retryCount < API_CONFIG.MAX_RETRIES)) {
      // Incrementa o contador de tentativas
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Adiciona um delay antes de tentar novamente
      await delay(API_CONFIG.RETRY_DELAY * originalRequest._retryCount);
      
      // Tenta a requisição novamente
      return api(originalRequest);
    }
    
    // Para outros erros ou se já excedeu o número máximo de tentativas
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR SEM LOGS DE DEPURAÇÃO ---
api.interceptors.request.use(
  (config) => {
    // REMOVIDO: console.log(`API Interceptor: Interceptando requisição...`);
    const token = sessionStorage.getItem("authToken");
    // REMOVIDO: console.log(`API Interceptor: Token encontrado...?`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // REMOVIDO: console.log(`API Interceptor: Header adicionado.`);
    }
    // REMOVIDO: else { console.warn(`API Interceptor: Token NÃO encontrado...`); }

    return config;
  },
  (error) => {
    // MANTIDO: Erro importante
    console.error("API Interceptor: Erro ANTES de enviar a requisição:", error);
    return Promise.reject(error);
  }
);
// --- FIM DA LIMPEZA ---

// Interceptor para respostas (logs de erro mantidos)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
