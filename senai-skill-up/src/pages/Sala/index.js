import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import "./style.css";

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const codigo = location.state?.codigo || null;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!codigo || !user?.id) {
      console.warn("Sala.js: Código ou usuário ausente, voltando para /game");
      navigate("/game");
      return;
    }

    let isMounted = true;

    const fetchSalaData = async () => {
      setErrorMsg("");
      try {
        const sala = await salaService.getSalaByPin(codigo);
        console.log("[Polling] Dados:", JSON.stringify(sala, null, 2));

        if (!isMounted || !sala) return;

        setSalaInfo(sala);
        // Ajuste aqui se o ID do usuário dono vier como 'usuarioId' ou outro nome
        setIsDonoDaSala(!!(user && sala.idUsuario === user.id));

        let participantesIds = [];
        // Prioriza 'idParticipantes' se existir, senão 'participantes' (se for array de IDs)
        if (
          Array.isArray(sala.idParticipantes) &&
          sala.idParticipantes.length > 0 &&
          typeof sala.idParticipantes[0] === "number"
        ) {
          participantesIds = sala.idParticipantes;
        } else if (
          Array.isArray(sala.participantes) &&
          sala.participantes.length > 0 &&
          typeof sala.participantes[0] === "number"
        ) {
          participantesIds = sala.participantes;
        }

        const currentIds = usuarios
          .map((u) => u.id)
          .sort()
          .join(",");
        const newIds = [...participantesIds].sort().join(",");

        if (
          newIds !== currentIds ||
          (participantesIds.length > 0 && usuarios.length === 0) ||
          (participantesIds.length === 0 && usuarios.length > 0)
        ) {
          if (participantesIds.length > 0) {
            console.log("Atualizando detalhes para IDs:", participantesIds);
            const userPromises = participantesIds.map((id) =>
              userService.getUserById(id)
            );
            const results = await Promise.allSettled(userPromises);
            if (!isMounted) return;
            const validUsers = results
              .filter((r) => r.status === "fulfilled" && r.value?.id)
              .map((r) => r.value);
            setUsuarios(validUsers);
            results
              .filter((r) => r.status === "rejected")
              .forEach((r) => console.error("Erro busca detalhe:", r.reason));
          } else {
            if (isMounted) setUsuarios([]);
            console.log("Nenhum participante.");
          }
        } else {
          // console.log("Lista IDs não mudou."); // Log opcional
        }
      } catch (error) {
        console.error("Erro fetchSalaData:", error);
        if (isMounted) setErrorMsg("Erro ao carregar dados da sala.");
      } finally {
        if (isMounted && loading) setLoading(false);
      }
    };

    fetchSalaData();
    const intervalId = setInterval(fetchSalaData, 5000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [codigo, navigate, user?.id, loading, usuarios]); // --- Handler Desmanchar/Sair (ATUALIZADO) ---

  const handleDesmanchar = async () => {
    if (!salaInfo || !user || actionLoading) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      if (isDonoDaSala) {
        // Dono desmancha
        if (window.confirm("Desmanchar esta sala para todos?")) {
          if (!salaInfo.idSala) throw new Error("ID da sala não encontrado.");
          console.log(`Sala.js: Dono desmanchando sala ID: ${salaInfo.idSala}`);
          await salaService.fecharSala(salaInfo.idSala);
          console.log("Sala.js: Sala desmanchada.");
          navigate("/game");
        } else {
          setActionLoading(false); // Cancelou
        }
      } else {
        // Participante sai
        if (window.confirm("Sair desta sala?")) {
          console.log(
            `Sala.js: Participante ${user.id} saindo da sala ${codigo}`
          );
          // ****** CHAMADA REAL AO SERVICE ******
          await salaService.sairDaSala(codigo, user.id);
          console.log(`Sala.js: Usuário ${user.id} saiu.`);
          navigate("/game");
        } else {
          setActionLoading(false); // Cancelou
        }
      }
    } catch (error) {
      console.error("Erro ao desmanchar/sair:", error); // Tenta pegar a mensagem de erro da resposta da API, senão a mensagem geral
      const backendError =
        error.response?.data?.message || error.response?.data;
      setErrorMsg(`Erro: ${backendError || error.message || "Ação falhou."}`);
      setActionLoading(false); // Garante desativar em caso de erro
    }
  }; // --- Handler Iniciar (sem alterações) ---

  const handleIniciar = async () => {
    if (
      !salaInfo ||
      !isDonoDaSala ||
      actionLoading ||
      !salaInfo.idFormulario ||
      !salaInfo.idSala
    ) {
      console.error(
        "Não pode iniciar: faltam dados, não é dono ou ação em progresso."
      );
      setErrorMsg("Não é possível iniciar. Dados da sala incompletos.");
      return;
    }
    setActionLoading(true);
    setErrorMsg("");
    try {
      const idFormularioParaJogar = salaInfo.idFormulario;
      const idSalaParaJogar = salaInfo.idSala;
      console.log(
        `Iniciando jogo F:${idFormularioParaJogar} S:${idSalaParaJogar}`
      );
      // TODO: API para iniciar sala?
      navigate("/jogo", {
        state: {
          idFormulario: idFormularioParaJogar,
          codigoSala: codigo,
          idSala: idSalaParaJogar,
        },
      });
    } catch (error) {
      console.error("Erro ao iniciar:", error);
      const apiErrorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      setErrorMsg(`Erro ao iniciar: ${apiErrorMessage || "Tente novamente."}`);
      setActionLoading(false); // Só desativa se deu erro ANTES de navegar
    }
  }; // --- Renderização ---

  return (
    <>
            <Header />     {" "}
      <div className="sala-container">
               {" "}
        <div className="sala-content">
                    <div className="sala-codigo">CODE: {codigo || "ERRO"}</div> 
                 {" "}
          {errorMsg && <div className="sala-mensagem error">{errorMsg}</div>}   
               {" "}
          <div className="sala-actions">
                       {" "}
            <button
              className="btn btn-danger"
              onClick={handleDesmanchar}
              disabled={loading || actionLoading}
            >
                           {" "}
              {isDonoDaSala ? "DESMANCHAR\nSALA" : "SAIR DA\nSALA"}           {" "}
            </button>
                       {" "}
            {isDonoDaSala && (
              <button
                className="btn btn-warning"
                onClick={handleIniciar}
                disabled={loading || actionLoading || usuarios.length < 1}
              >
                                INICIAR              {" "}
              </button>
            )}
                     {" "}
          </div>
                   {" "}
          <div className="sala-grid">
                       {" "}
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((participante) => (
                <div key={participante.id} className="sala-user">
                                   {" "}
                  <div
                    className="sala-avatar"
                    style={{
                      backgroundImage: participante.avatar
                        ? `url(${participante.avatar})`
                        : undefined,
                    }}
                  />
                                   {" "}
                  <div
                    className="nome"
                    style={{
                      fontWeight:
                        user && participante.id === user.id ? "bold" : "normal",
                    }}
                  >
                                       {" "}
                    {participante.nome || "Nome não encontrado"}               
                     {" "}
                  </div>
                                 {" "}
                </div>
              ))
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </>
  );
}
