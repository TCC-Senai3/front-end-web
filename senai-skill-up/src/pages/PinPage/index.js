import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import slogan from '../../assets/images/slogan com brilhos.svg';
import './style.css';
import Header from '../../components/header';
import salaService from "../../services/salaService";
import { useAuth } from '../../hooks/useAuth';

export default function PinPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('pinpage-body');
    document.documentElement.classList.add('pinpage-html');
    return () => {
      document.body.classList.remove('pinpage-body');
      document.documentElement.classList.remove('pinpage-html');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin || pin.length < 6) {
      setError("PIN inválido. Deve ter 6 dígitos.");
      return;
    }

    // Validação do usuário
    if (!user || !user.id) {
      alert("Erro: Usuário não autenticado. Faça login novamente.");
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idUsuarioLogado = user.id; // ID dinâmico

      const sala = await salaService.getSalaByPin(pin);
      if (!sala || !sala.idSala) {
        throw new Error("Sala não encontrada com este PIN.");
      }

      const idDaSala = sala.idSala;
      const pinDaSala = sala.codigoSala;

      await salaService.entrarNaSala(idDaSala, idUsuarioLogado); // Jogador entra na sala

      navigate('/sala', { state: { codigo: pinDaSala } });

    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      if (err.response && err.response.status === 404) {
        setError("PIN não encontrado.");
      } else {
        setError("Falha ao entrar na sala. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pinpage-bg">
      <Header />
      <div className="pinpage-center">
        <img src={slogan} alt="SENAI SKILL UP" className="pinpage-logo" />
        <form className="pinpage-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="PIN do jogo"
            className="pinpage-input"
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            className="pinpage-btn"
            disabled={loading}
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
          {error && <p style={{ color: 'white', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}