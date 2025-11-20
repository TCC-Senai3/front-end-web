import { useState, useEffect, useCallback } from 'react';
import { 
  getCache as getCacheService, 
  setCache as setCacheService, 
  removeCache as removeCacheService,
  cleanupExpiredCache,
  CACHE_KEYS,
  STORAGE_TYPES
} from '../services/cacheService';

/**
 * Hook personalizado para gerenciar cache de forma reativa
 * @param {string} cacheKey - Chave do cache (pode ser uma das CACHE_KEYS ou uma string personalizada)
 * @param {object} options - Opções adicionais
 * @param {string} [options.storageType=STORAGE_TYPES.LOCAL] - Tipo de armazenamento (LOCAL, SESSION, MEMORY)
 * @param {number} [options.ttl] - Tempo de vida em segundos (opcional)
 * @param {boolean} [options.autoCleanup=true] - Se deve limpar itens expirados automaticamente
 * @returns {[any, Function, Function]} - [cachedData, setCachedData, clearCachedData]
 */
const useCache = (cacheKey, {
  storageType = STORAGE_TYPES.LOCAL,
  ttl,
  autoCleanup = true
} = {}) => {
  const [cachedData, setCachedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega os dados do cache quando o hook é montado ou quando a chave muda
  const loadFromCache = useCallback(() => {
    try {
      setIsLoading(true);
      const data = getCacheService(cacheKey, storageType);
      setCachedData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, storageType]);

  // Efeito para carregar os dados do cache quando o hook é montado
  useEffect(() => {
    if (autoCleanup) {
      cleanupExpiredCache();
    }
    loadFromCache();
  }, [loadFromCache, autoCleanup]);

  /**
   * Define um valor no cache
   * @param {any} data - Dados a serem armazenados em cache
   * @param {object} options - Opções adicionais
   * @param {number} [options.customTtl] - Sobrescreve o TTL padrão
   * @returns {boolean} - Se a operação foi bem-sucedida
   */
  const setCachedDataValue = useCallback((data, { customTtl } = {}) => {
    try {
      setCacheService(
        cacheKey, 
        data, 
        storageType, 
        customTtl !== undefined ? customTtl : ttl
      );
      setCachedData(data);
      setError(null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, [cacheKey, storageType, ttl]);

  /**
   * Remove um item do cache
   * @returns {boolean} - Se a operação foi bem-sucedida
   */
  const clearCachedData = useCallback(() => {
    try {
      removeCacheService(cacheKey, storageType);
      setCachedData(null);
      setError(null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, [cacheKey, storageType]);

  return [
    cachedData,
    setCachedDataValue,
    clearCachedData,
    { isLoading, error, reload: loadFromCache }
  ];
};

export default useCache;

// Hook de conveniência para tipos comuns de cache
export const useUserCache = (options) => 
  useCache(CACHE_KEYS.USER_PROFILE, { storageType: STORAGE_TYPES.SESSION, ...options });

export const useQuizCache = (options) => 
  useCache(CACHE_KEYS.QUIZ_DATA, { storageType: STORAGE_TYPES.LOCAL, ...options });

export const useUsersListCache = (options) => 
  useCache(CACHE_KEYS.USERS_LIST, { storageType: STORAGE_TYPES.LOCAL, ...options });

export const useThemesCache = (options) => 
  useCache(CACHE_KEYS.THEMES, { storageType: STORAGE_TYPES.LOCAL, ...options });
