import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import formularioService from "../../services/formularioService"; // Carrega formulários
import salaService from "../../services/salaService";
import { useAuth } from "../../hooks/useAuth"; // Usa o hook de autenticação
import "./style.css";

export default function CriarSala() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado // Estados para o formulário

  const [nomeSala, setNomeSala] = useState("");
  const [idFormularioSelecionado, setIdFormularioSelecionado] = useState("");
  const [formularios, setFormularios] = useState([]); // Estado para os formulários // Estados de controle

  const [loading, setLoading] = useState(true); // Loading para buscar formulários
  const [error, setError] = useState(null);
  const [criandoSala, setCriandoSala] = useState(false); // Loading para criar a sala // Carrega os formulários (questionários) ao montar o componente

  useEffect(() => {
    const carregarFormularios = async () => {
      try {
        setLoading(true);
        setError(null); // Chama o serviço para buscar os formulários
        const data = await formularioService.getFormularios();
        if (Array.isArray(data)) {
          setFormularios(data);
        } else {
          setFormularios([]); // Garante que é um array
        }
      } catch (err) {
        setError("Erro ao carregar questionários");
      } finally {
        setLoading(false);
      }
    };
    carregarFormularios();
  }, []); // Roda apenas uma vez // Função chamada ao clicar no botão "CRIAR"

  const handleCriar = async () => {
    // Validações básicas
    if (!nomeSala || !idFormularioSelecionado) {
      alert("Por favor, preencha o nome da sala e selecione um questionário");
      return;
    } // Valida se o usuário está logado (pego pelo useAuth)

    if (!user || !user.id) {
      alert("Erro: Usuário não autenticado. Faça login novamente.");
      navigate("/login");
      return;
    }

    try {
      setCriandoSala(true); // Ativa o loading do botão
      const idUsuarioLogado = user.id; // Pega o ID do usuário logado // Monta o objeto JSON completo esperado pela API

      const salaData = {
        nomeSala: nomeSala,
        idUsuario: idUsuarioLogado,
        statusSala: "DISPONIVEL",
        idFormulario: parseInt(idFormularioSelecionado), // ID do formulário selecionado
        idTema: 1, // Usando idTema fixo 1, conforme discutimos
      }; // 1. Chama a API para CRIAR a sala

      const salaCriada = await salaService.createSala(salaData);

      const pinDaSala = salaCriada.codigoSala; // Valida se a API retornou o código

      if (!pinDaSala) {
        throw new Error(
          "API criou a sala mas não retornou o PIN ('codigoSala')."
        );
      } // 2. Chama a API para ENTRAR na sala recém-criada (usando o CÓDIGO)

      await salaService.entrarNaSala(pinDaSala, idUsuarioLogado);
      // 3. Navega para o Lobby, passando o CÓDIGO

      navigate("/sala", { state: { codigo: pinDaSala } });
    } catch (err) {
      const apiErrorMessage =
        err.response?.data?.message || err.response?.data || err.message;
      alert(
        `Erro: ${
          apiErrorMessage ||
          "Não foi possível criar ou entrar na sala. Tente novamente."
        }`
      );
    } finally {
      setCriandoSala(false); // Desativa o loading do botão
    }
  }; // Função para o botão de fechar o card/modal

  const handleFechar = () => {
    navigate("/game"); // Volta para a tela de opções de jogo
  };

  return (
    <>
      <Header />
      <div className="criar-sala-container">
        <div className="criar-sala-content">
          <h1 className="criar-sala-title">CRIAR SALA</h1>
          <div className="sala-card">
            <button className="close-btn" onClick={handleFechar}>
              ×
            </button>
            {/* Input para o Nome da Sala */}
            <div className="form-group">
              <label className="form-label">Nome da Sala</label>
              <input
                type="text"
                value={nomeSala}
                onChange={(e) => setNomeSala(e.target.value)}
                className="form-select"
                placeholder="Ex: Sala da Turma X"
                disabled={criandoSala}
              />
            </div>
            {/* Select para o Formulário (Questionário) */}
            <div className="form-group">
              <label className="form-label">Título do questionário</label>
              <select
                value={idFormularioSelecionado}
                onChange={(e) => setIdFormularioSelecionado(e.target.value)}
                className="form-select"
                disabled={loading || criandoSala}
              >
                <option value="">
                  {loading ? "Carregando..." : "Selecione o Questionário"}
                </option>
                {/* Mapeia a lista de FORMULÁRIOS */}
                {!loading &&
                  !error &&
                  formularios.map((form) => (
                    <option key={form.idFormulario} value={form.idFormulario}>
                      {form.titulo}
                    </option>
                  ))}
                {/* Mostra erro se houver */}
                {error && (
                  <option value="" disabled>
                    {error}
                  </option>
                )}
              </select>
            </div>
            {/* Mensagem se não encontrar formulários */}
            {!loading && !error && formularios.length === 0 && (
              <p style={{ textAlign: "center", color: "red" }}>
                Nenhum questionário encontrado.
              </p>
            )}
            {/* Botão Criar */}
            <button
              className="criar-btn"
              onClick={handleCriar}
              disabled={loading || criandoSala}
            >
              {criandoSala ? "CRIANDO..." : "CRIAR"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
