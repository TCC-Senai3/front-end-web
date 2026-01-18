import api from './api';

// Enviar resposta (requer autenticação)
export const enviarResposta = async (respostaData) => {
  const token = sessionStorage.getItem('token');
  const response = await api.post('/respostas',
    respostaData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default {
  enviarResposta
};
