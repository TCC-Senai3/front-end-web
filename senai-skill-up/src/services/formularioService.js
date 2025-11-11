import api from './api';

// Listar todos os formulários
export const getFormularios = async () => {
  try {
    const response = await api.get('/formularios');
    return response.data;
  } catch (error) {
    console.error("Erro ao listar formulários:", error);
    throw error; // Re-lança para o componente tratar
  }
};

// Criar novo formulário completo
export const createFormulario = async (quizData) => {
  if (!quizData) throw new Error("Dados do formulário são necessários.");
  try {
    const response = await api.post('/formularios/completo', quizData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar formulário:", error);
    throw error;
  }
};



export const getFormularioById = async (id) => {
  if (!id) throw new Error("ID do formulário é necessário.");
  try {
    // Ajuste a URL se o endpoint no backend for diferente (ex: /formularios/completo/{id})
    const response = await api.get(`/formularios/${id}`); 
    // Assumindo que a resposta já vem com as perguntas e alternativas aninhadas
    return response.data; 
  } catch (error) {
    console.error(`Erro ao buscar formulário com ID ${id}:`, error);
    throw error; 
  }
};


// 1. Criamos a constante com o objeto
const formularioService = {
  getFormularios,
  createFormulario,
  getFormularioById, 
};

// 2. Exportamos a constante
export default formularioService;