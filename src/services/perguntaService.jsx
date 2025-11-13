import api from './api';

// Listar todas as perguntas
export const getPerguntas = async () => {
  const response = await api.get('/perguntas');
  return response.data;
};

// Buscar pergunta por ID
export const getPerguntaById = async (id) => {
  const response = await api.get(`/perguntas/${id}`);
  return response.data;
};

// Criar nova pergunta (requer autenticação)
export const createPergunta = async (perguntaData) => {
  const token = sessionStorage.getItem('token');
  const response = await api.post('/perguntas',
    perguntaData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  getPerguntas,
  getPerguntaById,
  createPergunta
};
