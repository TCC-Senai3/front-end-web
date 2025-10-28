import api from "./api";

// Listar todas as salas
export const getSalas = async () => {
  const response = await api.get("/salas");
  return response.data;
};

// Buscar sala por ID (Numérico) - Mantemos esta função caso seja usada em outro lugar
export const getSalaById = async (id) => {
  const response = await api.get(`/salas/${id}`);
  return response.data;
};

// Criar nova sala
export const createSala = async (salaData) => {
  const response = await api.post("/salas", salaData);
  return response.data;
};

// --- CORREÇÃO APLICADA AQUI ---
// Entrar em uma sala (requer autenticação)
// Agora recebe o CODIGO (String) da sala, não o ID (Number)
export const entrarNaSala = async (codigoSala, idUsuario) => {
  const response = await api.post(
    // Usa o CODIGO (String) na URL, como o backend espera
    `/salas/${codigoSala}/entrar/${idUsuario}`
  );
  return response.data;
};
// --- FIM DA CORREÇÃO ---

// Busca sala pelo código PIN (String) - ATENÇÃO AO CAMINHO DA API
// Seu controller usa /salas/codigo/{codigo}, então ajustei aqui.
export const getSalaByPin = async (pin) => {
  // Verifique se o caminho no backend é realmente /salas/codigo/{codigo}
  // Se for /salas/pin/{pin}, volte para `/salas/pin/${pin}`
  const response = await api.get(`/salas/codigo/${pin}`);
  return response.data;
};


export default {
  getSalas,
  getSalaById,
  createSala,
  entrarNaSala, // Exporta a função corrigida
  getSalaByPin,
};