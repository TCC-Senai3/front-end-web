import api from "./api";

// Listar todas as salas
export const getSalas = async () => {
  const response = await api.get("/salas");
  return response.data;
};

// Buscar sala por ID
export const getSalaById = async (id) => {
  const response = await api.get(`/salas/${id}`);
  return response.data;
};

// --- CORREÇÃO AQUI ---
// Criar nova sala (requer autenticação - token adicionado pelo api.js)
export const createSala = async (salaData) => {
  // const token = sessionStorage.getItem('token'); // REMOVIDO
  const response = await api.post(
    "/salas",
    salaData /*, { headers: ... } REMOVIDO */
  );
  return response.data;
};
// --- FIM DA CORREÇÃO ---

// Entrar em uma sala (requer autenticação - token adicionado pelo api.js)
export const entrarNaSala = async (idSala, idUsuario) => {
  // const token = sessionStorage.getItem('token'); // REMOVIDO
  const response = await api.post(
    `/salas/${idSala}/entrar/${idUsuario}` /*, {}, { headers: ... } REMOVIDO */
  );
  return response.data;
};

// Busca sala pelo código PIN (requer autenticação)
export const getSalaByPin = async (pin) => {
  const response = await api.get(`/salas/pin/${pin}`);
  return response.data;
};

export default {
  getSalas,
  getSalaById,
  createSala,
  entrarNaSala,
  getSalaByPin, // Exporta a nova função
};
