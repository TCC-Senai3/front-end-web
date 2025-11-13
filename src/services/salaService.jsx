import api from "./api";

/**
 * Lista todas as salas.
 */
export const getSalas = async () => {
  try {
    const response = await api.get("/salas");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    throw error;
  }
};

/**
 * Busca sala por ID.
 */
export const getSalaById = async (id) => {
  if (!id) throw new Error("ID da sala é necessário.");
  try {
    const response = await api.get(`/salas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar sala com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Busca sala pelo PIN/código.
 */
export const getSalaByPin = async (pin) => {
  if (!pin) throw new Error("PIN é necessário.");
  try {
    const response = await api.get(`/salas/codigo/${pin}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar sala com PIN ${pin}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova sala.
 */
export const createSala = async (salaData) => {
  if (!salaData) throw new Error("Dados da sala são necessários.");
  try {
    const response = await api.post("/salas", salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    throw error;
  }
};

/**
 * Entrar em uma sala pelo código.
 */
export const entrarNaSala = async (codigoSala, idUsuario) => {
  if (!codigoSala || !idUsuario)
    throw new Error("Código da sala e ID do usuário são necessários.");
  try {
    const response = await api.post(`/salas/${codigoSala}/entrar/${idUsuario}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao entrar na sala ${codigoSala} para usuário ${idUsuario}:`,
      error
    );
    throw error;
  }
};

/**
 * Sair da sala.
 */
export const sairDaSala = async (codigoSala, idUsuario) => {
  if (!codigoSala || !idUsuario)
    throw new Error("Código da sala e ID do usuário são necessários para sair.");
  try {
    const response = await api.delete(`/salas/${codigoSala}/sair/${idUsuario}`);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao tentar sair da sala ${codigoSala} para usuário ${idUsuario}:`,
      error
    );
    throw error;
  }
};

/**
 * Fechar sala (apenas dono).
 */
export const fecharSala = async (idSala) => {
  if (!idSala) throw new Error("ID da sala é necessário para fechar.");
  try {
    const response = await api.put(`/salas/${idSala}/fechar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao fechar sala com ID ${idSala}:`, error);
    throw error;
  }
};

const salaService = {
  getSalas,
  getSalaById,
  getSalaByPin,
  createSala,
  entrarNaSala,
  sairDaSala,
  fecharSala,
};

// 2. Exportamos a constante
export default salaService;