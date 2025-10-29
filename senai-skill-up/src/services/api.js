import axios from "axios";

export const API_CONFIG = {
  BASE_URL: "https://apiosdrake.azurewebsites.net",
  TIMEOUT: 10000, // Configurações de retry podem ser removidas se não estiverem sendo usadas // RETRY_ATTEMPTS: 3, // RETRY_DELAY: 1000,
};

// Criar instância do Axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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
      // MANTIDO: Log de erro útil
      console.error(
        `Erro na resposta da API: ${error.response.status} para ${error.config.url}`,
        error.response.data || "(Sem dados)"
      );
      if (error.response.status === 401) {
        // MANTIDO: Log importante
        console.warn(
          "Sessão expirada ou inválida. Redirecionando para login..."
        );
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // MANTIDO: Erro importante
      console.error("Sem resposta do servidor:", error.request);
    } else {
      // MANTIDO: Erro importante
      console.error("Erro ao configurar requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
