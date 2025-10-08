// src/services/LoginService.js

import api from './api';
import { jwtDecode } from 'jwt-decode';
import localStorageService from './localStorageService';

// LOGIN ONLINE → envia email e senha para o backend, recebe token JWT
export const login = async (email, senha) => {
  try {
    const response = await api.post('/usuarios/login', { email, senha });
    return response;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('API offline, tentando login local...');
      return await loginLocal(email, senha);
    }
    throw error;
  }
};

// LOGIN LOCAL → autentica usuário usando dados locais (modo offline)
export const loginLocal = async (email, senha) => {
  try {
    const authResult = localStorageService.authenticateUser(email, senha);
    if (authResult) {
      // Converte o resultado do localStorageService para o formato esperado
      return {
        data: {
          token: authResult.token,
          userData: authResult.user
        }
      };
    } else {
      throw new Error('Credenciais inválidas');
    }
  } catch (error) {
    console.error('Erro no login local:', error);
    throw error;
  }
};

// CADASTRO ONLINE → envia dados do usuário para o backend
export const register = async (userData) => {
  try {
    const response = await api.post('/usuarios/cadastro', userData);
    return response;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('API offline, usando cadastro local...');
      return await registerLocal(userData);
    }
    throw error;
  }
};

// CADASTRO LOCAL → cria usuário usando dados locais (modo offline)
export const registerLocal = async (userData) => {
  try {
    // Verifica se o email já está cadastrado
    const existingUser = localStorageService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Cria novo usuário local
    const newUser = localStorageService.createUser(userData);

    // Retorna resposta simulada para manter compatibilidade
    return {
      data: {
        message: 'Usuário cadastrado com sucesso (modo offline)',
        user: newUser
      }
    };
  } catch (error) {
    console.error('Erro no cadastro local:', error);
    throw error;
  }
};

// BUSCAR PERFIL → busca dados completos do usuário pelo ID
export const getProfile = (userId, token) => {
  return api.get(`/usuarios/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ADICIONAR BIOGRAFIA → atualiza biografia do usuário (requer autenticação)
export const updateBiografia = (userId, biografia) => {
  const token = sessionStorage.getItem('token');
  return api.post(`/usuarios/${userId}/biografia`,
    { biografia },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Armazena dados do usuário na sessão (temporário)
export const setUserData = (userData) => {
  sessionStorage.setItem('dadosUsuario', JSON.stringify(userData));
  if (userData.token) {
    sessionStorage.setItem('token', userData.token);
  }
};

// Recupera dados do usuário da sessão
export const getUserData = () => {
  const userData = sessionStorage.getItem('dadosUsuario');
  return userData ? JSON.parse(userData) : null;
};

// Limpa os dados do usuário
export const clearUserData = () => {
  sessionStorage.removeItem('dadosUsuario');
  sessionStorage.removeItem('token');
};

// Verifica se o usuário está logado
export const isLoggedIn = () => {
  const token = sessionStorage.getItem('token');
  return !!token;
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
