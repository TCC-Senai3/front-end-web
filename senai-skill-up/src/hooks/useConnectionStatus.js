import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Se estava offline e voltou online, redireciona para home
      if (window.location.pathname === '/connection-error') {
        navigate('/');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Redireciona para página de erro de conexão
      navigate('/connection-error');
    };

    // Adiciona listeners para eventos de conexão
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verifica status inicial
    if (!navigator.onLine) {
      navigate('/connection-error');
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  return isOnline;
};



