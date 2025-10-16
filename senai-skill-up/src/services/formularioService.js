import api from './api';

// Listar todos os formulários
export const getFormularios = async () => {
  const response = await api.get('/formularios');
  return response.data;
};

// Criar novo formulário (requer autenticação)
export const createFormulario = async (titulo, descricao = '') => {
  const token = sessionStorage.getItem('token');
  const response = await api.post('/formularios',
    { titulo, descricao },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  getFormularios,
  createFormulario
};
