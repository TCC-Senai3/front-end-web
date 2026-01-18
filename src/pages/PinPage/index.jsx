import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import slogan from "../../assets/images/slogan (3).svg";
import "./style.css";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import { useAuth } from "../../hooks/useAuth";

export default function PinPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado

  const [pin, setPin] = useState(""); // PIN digitado pelo usuário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add("pinpage-body");
    document.documentElement.classList.add("pinpage-html");
    return () => {
      document.body.classList.remove("pinpage-body");
      document.documentElement.classList.remove("pinpage-html");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin || pin.length < 6) {
      setError("PIN inválido. Deve ter 6 dígitos.");
      return;
    } // Validação do usuário

    if (!user || !user.id) {
      alert("Erro: Usuário não autenticado. Faça login novamente.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idUsuarioLogado = user.id; // ID dinâmico

      // 1. Busca a sala pelo PIN digitado (que é o 'codigoSala')
      console.log(`Buscando sala com PIN digitado: ${pin}`);
      const sala = await salaService.getSalaByPin(pin);
      console.log("Dados da sala encontrados:", sala);

      // Validação mais robusta da resposta da API
      if (!sala || !sala.idSala || !sala.codigoSala) {
        throw new Error(
          "Sala não encontrada com este PIN ou resposta da API inválida."
        );
      }

      // 2. Pega o CÓDIGO retornado pela API (Ex: "719881")
      const codigoDaSala = sala.codigoSala;
      // const idDaSala = sala.idSala; // Não usamos o ID numérico aqui

      // ****** CORREÇÃO CRUCIAL AQUI ******
      // 3. Passa o CÓDIGO (codigoDaSala) para a função entrarNaSala
      console.log(
        `Tentando entrar na sala ${codigoDaSala} com usuário ${idUsuarioLogado}`
      );
      await salaService.entrarNaSala(codigoDaSala, idUsuarioLogado);
      console.log("Entrou na sala com sucesso!");

      // 4. Navega para o Lobby usando o CÓDIGO
      navigate("/sala", { state: { codigo: codigoDaSala } });
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      // Tratamento de erro
      if (err.message.includes("Sala não encontrada")) {
        setError("PIN não encontrado.");
      } else if (err.response && err.response.status === 403) {
        setError(
          "Acesso negado. Você não tem permissão para entrar nesta sala."
        );
      } else {
        const apiErrorMessage =
          err.response?.data?.message || err.response?.data || err.message;
        setError(
          `Falha ao entrar na sala: ${apiErrorMessage || "Tente novamente."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pinpage-bg">
            <Header />     {" "}
      <div className="pinpage-center">
               {" "}
        <img src={slogan} alt="SENAI SKILL UP" className="pinpage-logo" />     
         {" "}
        <form className="pinpage-form" onSubmit={handleSubmit}>
                   {" "}
          <input
            type="text"
            placeholder="PIN do jogo"
            className="pinpage-input"
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            maxLength={6}
            disabled={loading}
          />
                   {" "}
          <button type="submit" className="pinpage-btn" disabled={loading}>
                        {loading ? "ENTRANDO..." : "ENTRAR"}         {" "}
          </button>
                   {" "}
          {error && (
            <p style={{ color: "white", marginTop: "10px" }}>{error}</p>
          )}
                 {" "}
        </form>
             {" "}
      </div>
         {" "}
    </div>
  );
}
