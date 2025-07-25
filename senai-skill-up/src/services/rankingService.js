import api from './api';

export const getGlobalRanking = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockUsers = [
        { id: 'user1', nome: 'Alice', pontos: 1200, icon: '/assets/images/image 6.svg' },
        { id: 'user2', nome: 'Bob', pontos: 1100, icon: '/assets/images/image 7.svg' },
        { id: 'user3', nome: 'Charlie', pontos: 1000, icon: '/assets/images/image 8.svg' },
      ];

      for (let i = 4; i <= 25; i++) {
        mockUsers.push({
          id: `user${i}`,
          nome: `Usuario${i}`,
          pontos: 1000 - (i * 20),
        });
      }

      resolve({
        data: mockUsers
      });
    }, 500);
  });
};

export const getUserScore = (userId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockScores = {
        'mockUserId': { score: 950 },
        'user1': { score: 1200 },
        'user2': { score: 1100 },
        'user3': { score: 1000 },
      };

      for (let i = 4; i <= 25; i++) {
        mockScores[`user${i}`] = { score: 1000 - (i * 20) };
      }

      resolve({
        data: mockScores[userId] || { score: 0 }
      });
    }, 500);
  });
};

export const updateScore = (userId, score) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Mock: Pontuação do usuário ${userId} atualizada para ${score}`);
      resolve({ data: { success: true, userId, score } });
    }, 500);
  });
}; 