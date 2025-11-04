import React, { useState } from 'react';
// 1. Importe useLocation
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../hooks/useAuth';
import salaService from '../../../services/salaService';
// Importe seu CSS aqui (ex: './style.css')

// Este é o componente que está na rota "/jogo" (sua tela de Criar Sala)
export default function Game() { 
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 2. Use o hook useLocation para ler o 'state'
  const location = useLocation(); 

  const [pin, setPin] = useState(""); 
  const [loading, setLoading] = useState(false);

  // 3. Leia os dados do "state" que o GameContent enviou
  // O nome 'quizSelecionado' deve ser o mesmo usado no 'navigate'
  const quizPreSelecionado = location.state?.quizSelecionado;

  // Função para CRIAR sala
  const handleCriarSala = async () => {
    if (!user) {
      alert("Você precisa estar logado para criar uma sala.");
      return;
    }

    // 4. Verifique se o quizPreSelecionado existe
    // (Assumindo que o objeto 'quiz' tem 'idFormulario' e 'titulo')
    if (!quizPreSelecionado || !quizPreSelecionado.idFormulario) { 
      alert("Erro: Nenhum formulário foi selecionado."); 
      // Envia o usuário de volta para a lista para escolher um
      navigate("/home"); // Ou para a rota onde está o GameContent
      return;
    }

    setLoading(true);
    try {
      const salaData = {
        idUsuario: user.id,
        idFormulario: quizPreSelecionado.idFormulario, // Use o ID do quiz
        nomeSala: `Sala de ${user.nome}` // Nome padrão da sala
      };

      // 5. Crie a sala
      const novaSala = await salaService.createSala(salaData);

      // 6. Navegue para o lobby da sala (Sala.js)
      navigate(`/sala/${novaSala.codigoSala}`, { 
        state: { codigo: novaSala.codigoSala } 
      });

    } catch (error) {
      console.error("Erro ao criar sala", error);
      alert("Não foi possível criar a sala.");
    } finally {
      setLoading(false);
    }
  };

  // Função para ENTRAR em sala (PIN)
  const handleEntrarSala = async () => {
    // (Aqui vai sua lógica existente para entrar com PIN)
    // Exemplo:
    if (!pin) return alert("Digite um PIN.");
    setLoading(true);
    try {
      // (Lógica de entrar na sala...)
      // navigate(`/sala/${pin}`, { state: { codigo: pin } });
    } catch (error) {
      alert("Sala não encontrada ou erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-container"> {/* Use sua classe de container */}
      {/* (Header, etc.) */}
      
      {/* Seção de Entrar na Sala (existente) */}
      <div className="entrar-sala-box">
        <input 
          type="text" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)}
          placeholder="Digite o PIN"
          disabled={loading}
        />
        <button onClick={handleEntrarSala} disabled={loading}>
          Entrar na Sala
        </button>
      </div>

      <hr /> 

      {/* --- 7. SEÇÃO DE CRIAR SALA ATUALIZADA --- */}
      <div className="criar-sala-box">
        {quizPreSelecionado ? (
          // Se um formulário foi selecionado:
          <>
            <h3>Criar Sala com o Quiz:</h3>
            <p><strong>{quizPreSelecionado.titulo || 'Quiz Selecionado'}</strong></p>
            <button onClick={handleCriarSala} disabled={loading}>
              {loading ? "Criando..." : "Confirmar e Criar Sala"}
            </button>
          </>
        ) : (
          // Se nenhum formulário foi selecionado (usuário veio direto para /game):
          <>
            <h3>Criar uma nova sala</h3>
            <p>Para criar uma sala, primeiro escolha um quiz na lista.</p>
            <button onClick={() => navigate('/home')} disabled={loading}> 
              {/* Ou '/formularios', etc. */}
              Escolher um Quiz
            </button>
          </>
        )}
      </div>

    </div>
  );
}