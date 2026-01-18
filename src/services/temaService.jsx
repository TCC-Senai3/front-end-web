import api from './api';

// Listar todos os temas (NÃO requer autenticação)
export const getTemas = async () => {
  try {
    const response = await api.get('/temas');
    console.log('✅ Temas carregados:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao carregar temas:', error);
    throw error;
  }
};

// Criar novo tema (requer autenticação)
export const createTema = async (nomeTema) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await api.post('/temas', 
      { nomeTema },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Tema criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar tema:', error);
    throw error;
  }
};

export default {
  getTemas,
  createTema
};
