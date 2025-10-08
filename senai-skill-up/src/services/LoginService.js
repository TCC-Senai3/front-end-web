// src/services/LoginService.js
import api from './api';
import { jwtDecode } from 'jwt-decode';

// LOGIN → envia email e senha para o backend, recebe token JWT
export const login = async (email, senha) => {
  const response = await api.post('/usuarios/login', { email, senha });
  return response;
};

// CADASTRO → envia dados do usuário para o backend
export const register = async (userData) => {
  const response = await api.post('/usuarios/cadastro', userData);
  return response;
};

// BUSCAR PERFIL → busca dados completos do usuário pelo ID
export const getProfile = (userId) => {
  return api.get(`/usuarios/${userId}`);
};

// ATUALIZAR BIOGRAFIA → atualiza biografia do usuário (requer autenticação)
export const updateBiografia = (userId, biografia) => {
  return api.post(`/usuarios/${userId}/biografia`, { biografia });
};

// Decodifica o token JWT para extrair informações (como email)
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};
