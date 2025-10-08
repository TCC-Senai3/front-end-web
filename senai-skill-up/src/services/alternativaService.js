import api from './api';

// Listar todas as alternativas
export const getAlternativas = async () => {
  const response = await api.get('/alternativas');
  return response.data;
};

// Buscar alternativa por ID
export const getAlternativaById = async (id) => {
  const response = await api.get(`/alternativas/${id}`);
  return response.data;
};

// Criar nova alternativa (requer autenticação)
export const createAlternativa = async (alternativaData) => {
  const token = sessionStorage.getItem('token');
  const response = await api.post('/alternativas',
    alternativaData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  getAlternativas,
  getAlternativaById,
  createAlternativa
};
