import api from './api';

// Listar todas as salas
export const getSalas = async () => {
  const response = await api.get('/salas');
  return response.data;
};

// Buscar sala por ID
export const getSalaById = async (id) => {
  const response = await api.get(`/salas/${id}`);
  return response.data;
};

// Criar nova sala (requer autenticação)
export const createSala = async (salaData) => {
  const token = sessionStorage.getItem('token');
  const response = await api.post('/salas',
    salaData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Entrar em uma sala (requer autenticação)
export const entrarNaSala = async (idSala, idUsuario) => {
  const token = sessionStorage.getItem('token');
  const response = await api.post(`/salas/${idSala}/entrar/${idUsuario}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  getSalas,
  getSalaById,
  createSala,
  entrarNaSala
};
