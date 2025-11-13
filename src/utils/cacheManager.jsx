// Sistema de cache inteligente para otimizar chamadas de API
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Máximo de itens no cache
    this.cleanupInterval = 60000; // Limpeza a cada minuto

    // Iniciar limpeza automática
    this.startCleanupTimer();
  }

  // Definir item no cache
  set(key, data, ttl = 300000) { // TTL padrão: 5 minutos
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccess: Date.now()
    };

    // Remover item antigo se cache cheio
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, cacheItem);

    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl}ms)`);
    }

    return cacheItem;
  }

  // Obter item do cache
  get(key) {
    const cacheItem = this.cache.get(key);

    if (!cacheItem) {
      return null;
    }

    // Verificar se expirou
    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;
    if (isExpired) {
      this.cache.delete(key);

      if (process.env.NODE_ENV === 'development') {
        console.log(`⏰ Cache EXPIRED: ${key}`);
      }

      return null;
    }

    // Atualizar estatísticas de acesso
    cacheItem.accessCount++;
    cacheItem.lastAccess = Date.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`📖 Cache HIT: ${key} (acessos: ${cacheItem.accessCount})`);
    }

    return cacheItem.data;
  }

  // Verificar se item existe e não expirou
  has(key) {
    const cacheItem = this.cache.get(key);
    if (!cacheItem) return false;

    const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;
    return !isExpired;
  }

  // Remover item específico
  delete(key) {
    const deleted = this.cache.delete(key);

    if (process.env.NODE_ENV === 'development' && deleted) {
      console.log(`🗑️ Cache DELETE: ${key}`);
    }

    return deleted;
  }

  // Limpar todo o cache
  clear() {
    const size = this.cache.size;
    this.cache.clear();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🧹 Cache CLEARED: ${size} itens removidos`);
    }
  }

  // Obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let totalSize = 0;
    let expiredCount = 0;
    let totalAccessCount = 0;

    for (const [key, item] of this.cache.entries()) {
      totalSize += JSON.stringify(item.data).length;
      totalAccessCount += item.accessCount;

      if (now - item.timestamp > item.ttl) {
        expiredCount++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalSize: Math.round(totalSize / 1024), // KB
      expiredCount,
      totalAccessCount,
      hitRate: totalAccessCount > 0 ? Math.round((totalAccessCount / (totalAccessCount + this.cache.size)) * 100) : 0
    };
  }

  // Remover item menos recentemente usado (LRU)
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < oldestTime) {
        oldestTime = item.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);

      if (process.env.NODE_ENV === 'development') {
        console.log(`🚮 Cache EVICT LRU: ${oldestKey}`);
      }
    }
  }

  // Limpeza automática de itens expirados
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0 && process.env.NODE_ENV === 'development') {
      console.log(`🧽 Cache CLEANUP: ${keysToDelete.length} itens expirados removidos`);
    }
  }

  // Iniciar timer de limpeza automática
  startCleanupTimer() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // Forçar limpeza imediata
  forceCleanup() {
    this.cleanup();
  }

  // Obter todos os keys do cache (para debug)
  getKeys() {
    return Array.from(this.cache.keys());
  }

  // Obter item do cache com metadados (para debug)
  getCacheItem(key) {
    return this.cache.get(key);
  }
}

// Instância singleton
const cacheManager = new CacheManager();

// Hook personalizado para usar cache em componentes React
export const useCache = (key, fetcher, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache primeiro
        const cachedData = cacheManager.get(key);
        if (cachedData && options.useCache !== false) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Buscar dados
        const freshData = await fetcher();

        if (isMounted) {
          setData(freshData);

          // Armazenar no cache se habilitado
          if (options.cache !== false) {
            cacheManager.set(key, freshData, options.ttl);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [key]);

  const invalidate = () => {
    cacheManager.delete(key);
    // Recarregar dados seria feito através de um novo render
  };

  return { data, loading, error, invalidate };
};

// Exportar funções utilitárias para uso direto
export const cacheUtils = {
  set: (key, data, ttl) => cacheManager.set(key, data, ttl),
  get: (key) => cacheManager.get(key),
  has: (key) => cacheManager.has(key),
  delete: (key) => cacheManager.delete(key),
  clear: () => cacheManager.clear(),
  getStats: () => cacheManager.getStats(),
  getKeys: () => cacheManager.getKeys(),
  getCacheItem: (key) => cacheManager.getCacheItem(key),
  cleanup: () => cacheManager.cleanup()
};

export default cacheManager;
