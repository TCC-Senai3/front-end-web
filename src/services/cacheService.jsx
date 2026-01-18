/**
 * Serviço para gerenciamento de cache da aplicação
 * Fornece funções para armazenar, recuperar e limpar dados em cache
 */

// Chaves de cache utilizadas na aplicação
export const CACHE_KEYS = {
  USER_DATA: 'user_data',
  USER_PROFILE: 'user_profile',
  QUIZ_DATA: 'quiz_data',
  USERS_LIST: 'users_list',
  THEMES: 'themes',
  // Adicione outras chaves de cache conforme necessário
};

/**
 * Tipos de armazenamento disponíveis
 */
export const STORAGE_TYPES = {
  SESSION: 'session',  // sessionStorage - limpo ao fechar o navegador
  LOCAL: 'local',      // localStorage - persiste até ser explicitamente limpo
  MEMORY: 'memory'     // memória (objeto em tempo de execução)
};

// Cache em memória
const memoryCache = new Map();

/**
 * Obtém o armazenamento correto com base no tipo
 */
const getStorage = (type = STORAGE_TYPES.LOCAL) => {
  switch (type) {
    case STORAGE_TYPES.SESSION:
      return window.sessionStorage;
    case STORAGE_TYPES.MEMORY:
      return {
        getItem: (key) => memoryCache.get(key),
        setItem: (key, value) => memoryCache.set(key, value),
        removeItem: (key) => memoryCache.delete(key),
        clear: () => memoryCache.clear(),
      };
    case STORAGE_TYPES.LOCAL:
    default:
      return window.localStorage;
  }
};

/**
 * Armazena dados em cache
 * @param {string} key - Chave do cache
 * @param {any} data - Dados a serem armazenados
 * @param {string} storageType - Tipo de armazenamento (default: localStorage)
 * @param {number} ttl - Tempo de vida em segundos (opcional)
 */
export const setCache = (key, data, storageType = STORAGE_TYPES.LOCAL, ttl = null) => {
  try {
    const storage = getStorage(storageType);
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttl ? ttl * 1000 : null, // Converter para milissegundos
    };
    storage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Erro ao armazenar no cache (${key}):`, error);
  }
};

/**
 * Obtém dados do cache
 * @param {string} key - Chave do cache
 * @param {string} storageType - Tipo de armazenamento (default: localStorage)
 * @returns {any|null} Dados em cache ou null se não existir ou expirado
 */
export const getCache = (key, storageType = STORAGE_TYPES.LOCAL) => {
  try {
    const storage = getStorage(storageType);
    const cached = storage.getItem(key);
    
    if (!cached) return null;
    
    const { data, timestamp, ttl } = JSON.parse(cached);
    
    // Verifica se o cache expirou
    if (ttl && (Date.now() - timestamp > ttl)) {
      // Remove o item expirado
      storage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Erro ao recuperar do cache (${key}):`, error);
    return null;
  }
};

/**
 * Remove um item específico do cache
 * @param {string} key - Chave do cache a ser removida
 * @param {string} storageType - Tipo de armazenamento (opcional, remove de todos se não especificado)
 */
export const removeCache = (key, storageType = null) => {
  try {
    if (storageType) {
      const storage = getStorage(storageType);
      storage.removeItem(key);
    } else {
      // Remove de todos os tipos de armazenamento
      Object.values(STORAGE_TYPES).forEach(type => {
        const storage = getStorage(type);
        storage.removeItem(key);
      });
    }
  } catch (error) {
    console.error(`Erro ao remover do cache (${key}):`, error);
  }
};

/**
 * Limpa todo o cache ou um conjunto de chaves específicas
 * @param {string[]} keysToClear - Array de chaves para limpar (opcional, limpa tudo se não especificado)
 * @param {string} storageType - Tipo de armazenamento (opcional, limpa de todos se não especificado)
 */
export const clearCache = (keysToClear = null, storageType = null) => {
  try {
    if (storageType) {
      const storage = getStorage(storageType);
      
      if (keysToClear && Array.isArray(keysToClear)) {
        // Limpa apenas as chaves especificadas
        keysToClear.forEach(key => storage.removeItem(key));
      } else {
        // Limpa todo o armazenamento do tipo especificado
        storage.clear();
      }
    } else {
      // Limpa de todos os tipos de armazenamento
      Object.values(STORAGE_TYPES).forEach(type => {
        const storage = getStorage(type);
        
        if (keysToClear && Array.isArray(keysToClear)) {
          // Limpa apenas as chaves especificadas em todos os armazenamentos
          keysToClear.forEach(key => storage.removeItem(key));
        } else {
          // Limpa todo o armazenamento
          storage.clear();
        }
      });
    }
    
    // Limpa também o cache em memória se for uma limpeza completa
    if (!keysToClear && !storageType) {
      memoryCache.clear();
    }
  } catch (error) {
    console.error('Erro ao limpar o cache:', error);
  }
};

/**
 * Limpa automaticamente itens de cache expirados
 */
export const cleanupExpiredCache = () => {
  try {
    // Verifica todos os tipos de armazenamento, exceto memória
    Object.values(STORAGE_TYPES)
      .filter(type => type !== STORAGE_TYPES.MEMORY)
      .forEach(type => {
        const storage = getStorage(type);
        
        // Itera sobre todas as chaves do armazenamento
        Object.keys(storage).forEach(key => {
          try {
            const cached = storage.getItem(key);
            if (cached) {
              const { timestamp, ttl } = JSON.parse(cached);
              
              // Se tiver TTL e estiver expirado, remove
              if (ttl && (Date.now() - timestamp > ttl)) {
                storage.removeItem(key);
              }
            }
          } catch (e) {
            // Se não for um item de cache válido, ignora
          }
        });
      });
  } catch (error) {
    console.error('Erro ao limpar cache expirado:', error);
  }
};

/**
 * Limpa o cache relacionado ao usuário ao fazer logout
 */
export const clearUserCache = () => {
  // Remove dados sensíveis do usuário
  const userCacheKeys = [
    CACHE_KEYS.USER_DATA,
    CACHE_KEYS.USER_PROFILE,
    'authToken',
    'refreshToken',
    'userData'
  ];
  
  clearCache(userCacheKeys);
  
  // Limpa também o cache de sessão que pode conter dados do usuário
  clearCache(null, STORAGE_TYPES.SESSION);
};

/**
 * Inicializa o serviço de cache
 * - Configura limpeza automática de itens expirados
 * - Executa a limpeza a cada 5 minutos
 */
const initCacheService = () => {
  // Limpa itens expirados na inicialização
  cleanupExpiredCache();
  
  // Configura limpeza periódica (a cada 5 minutos)
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
  
  // Limpa o cache ao fechar a aba/janela (apenas para sessionStorage)
  window.addEventListener('beforeunload', () => {
    // Não limpa o sessionStorage aqui, pois é gerenciado automaticamente pelo navegador
    // Mas podemos limpar o cache em memória
    memoryCache.clear();
  });
};

// Inicializa o serviço de cache quando o módulo for carregado
if (typeof window !== 'undefined') {
  initCacheService();
}

export default {
  set: setCache,
  get: getCache,
  remove: removeCache,
  clear: clearCache,
  clearUser: clearUserCache,
  cleanup: cleanupExpiredCache,
  STORAGE_TYPES,
  CACHE_KEYS,
};
