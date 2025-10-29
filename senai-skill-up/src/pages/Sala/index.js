import React, { useState, useEffect, useRef } from "react"; // Adicionado useRef
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SockJS from "sockjs-client"; // <<< Adicionado import SockJS
import { Client } from "@stomp/stompjs"; // <<< Adicionado import Cliente STOMP
import "./style.css";

export default function Sala() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pega usuário logado

  const codigo = location.state?.codigo || null;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null);
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const stompClientRef = useRef(null); // Ref para o cliente STOMP

  // --- Efeito para Conexão WebSocket (Dependências Corrigidas) ---
  useEffect(() => {
    // Só conecta se tivermos código E se o usuário já estiver carregado
    if (!codigo || !user?.id) {
        console.log("WebSocket: Aguardando código da sala e usuário...");
        return; // Sai se não tiver código ou usuário ainda
    }

    const socketUrl = "http://localhost:8080/ws";
    console.log("Sala.js: Configurando conexão WebSocket...");

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("WebSocket Conectado:", frame);
        const topic = `/topic/sala/${codigo}`;
        console.log(`Inscrevendo-se em ${topic}`);
        client.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log(`Mensagem recebida em ${topic}:`, payload);

            if (payload.type === "JOGO_INICIADO") {
              console.log("Mensagem de início de jogo recebida! Navegando...");
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", {
                state: { idFormulario, idSala, codigoSala },
              });
            }
          } catch (e) {
            console.error("Erro ao processar mensagem WebSocket:", e, message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
        setErrorMsg("Erro de comunicação com o servidor.");
      },
      onWebSocketError: (error) => {
        console.error("Erro WebSocket:", error);
        setErrorMsg("Erro de conexão. Tente atualizar a página.");
      },
      onDisconnect: () => {
        console.log("WebSocket Desconectado");
      },
    });

    console.log("Ativando cliente WebSocket...");
    client.activate();
    stompClientRef.current = client;

    // --- Função de Limpeza ---
    return () => {
      console.log("Sala.js: Desmontando componente, desativando cliente WebSocket...");
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
        console.log("Cliente WebSocket desativado.");
      }
    };
  // <<< CORREÇÃO AQUI: Removido 'user' da lista de dependências para evitar reconexões desnecessárias >>>
  }, [codigo, navigate]); 
  // <<< FIM DA CORREÇÃO >>>


  // --- useEffect do Polling (Mantido por enquanto) ---
  useEffect(() => {
    if (!codigo || !user?.id) {
      console.warn("Sala.js: Código ou usuário ausente (polling), voltando para /game");
      navigate("/game");
      return;
    }
    let isMounted = true;
    const fetchSalaData = async () => {
      setErrorMsg("");
      try {
        const sala = await salaService.getSalaByPin(codigo);
        if (!isMounted || !sala) return;
        setSalaInfo(sala);
        setIsDonoDaSala(!!(user && sala.idUsuario === user.id));
        let participantesIds = [];
        if (Array.isArray(sala.idParticipantes) && sala.idParticipantes.length > 0 && typeof sala.idParticipantes[0] === 'number') {
            participantesIds = sala.idParticipantes;
        } else if (Array.isArray(sala.participantes) && sala.participantes.length > 0 && typeof sala.participantes[0] === 'number') {
          participantesIds = sala.participantes;
        }
        const currentIds = usuarios.map((u) => u.id).sort().join(",");
        const newIds = [...participantesIds].sort().join(",");
        if (newIds !== currentIds || (participantesIds.length > 0 && usuarios.length === 0) || (participantesIds.length === 0 && usuarios.length > 0)) {
          if (participantesIds.length > 0) {
            console.log("Polling: Atualizando detalhes para IDs:", participantesIds);
            const userPromises = participantesIds.map((id) => userService.getUserById(id));
            const results = await Promise.allSettled(userPromises);
            if (!isMounted) return;
            const validUsers = results.filter((r) => r.status === "fulfilled" && r.value?.id).map((r) => r.value);
            setUsuarios(validUsers);
            results.filter((r) => r.status === "rejected").forEach((r) => console.error("Polling: Erro busca detalhe:", r.reason));
          } else {
            if (isMounted) setUsuarios([]);
            console.log("Polling: Nenhum participante.");
          }
        }
      } catch (error) {
        console.error("Erro fetchSalaData (Polling):", error);
        if (isMounted) setErrorMsg("Erro ao carregar dados da sala.");
      } finally {
        if (isMounted && loading) setLoading(false);
      }
    };

    fetchSalaData(); // Busca inicial
    const intervalId = setInterval(fetchSalaData, 5000); // Continua o polling
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [codigo, navigate, user?.id, loading, usuarios]); // Polling ainda depende de user?.id


  // --- Handler Desmanchar/Sair (Lógica inalterada) ---
  const handleDesmanchar = async () => {
    if (!salaInfo || !user || actionLoading) return;
    setActionLoading(true);
    setErrorMsg("");
    try {
      if (isDonoDaSala) {
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
        if (window.confirm("Sair desta sala?")) {
          console.log(`Sala.js: Participante ${user.id} saindo da sala ${codigo}`);
          await salaService.sairDaSala(codigo, user.id);
          console.log(`Sala.js: Usuário ${user.id} saiu.`);
          navigate("/game");
        } else {
          setActionLoading(false); // Cancelou
        }
      }
    } catch (error) {
      console.error("Erro ao desmanchar/sair:", error);
      const backendError = error.response?.data?.message || error.response?.data;
      setErrorMsg(`Erro: ${backendError || error.message || "Ação falhou."}`);
      setActionLoading(false);
    }
  };

  // --- Handler Iniciar (MODIFICADO PARA WEBSOCKET) ---
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !stompClientRef.current?.active) {
      const motivoErro = !stompClientRef.current?.active
        ? "Não conectado ao servidor."
        : "Faltam dados ou não é o dono.";
      console.error("Não pode iniciar o jogo:", motivoErro);
      setErrorMsg(`Não é possível iniciar. ${motivoErro}`);
      return;
    }
    setActionLoading(true);
    setErrorMsg("");
    try {
      const destination = `/app/sala/${codigo}/iniciar`;
      console.log(`Sala.js: Publicando mensagem 'iniciar' para ${destination}`);
      stompClientRef.current.publish({
        destination: destination,
        // body: JSON.stringify({ }) // Adicione corpo se necessário
      });
      // A navegação acontece no 'subscribe'
    } catch (error) {
      console.error("Erro ao publicar mensagem 'iniciar':", error);
      setErrorMsg("Falha ao enviar comando de início. Verifique a conexão.");
      setActionLoading(false);
    }
  };

  // --- Renderização (Estrutura JSX inalterada) ---
  return (
    <>
      <Header />
      <div className="sala-container">
        <div className="sala-content">
          <div className="sala-codigo">CODE: {codigo || "ERRO"}</div>
          {errorMsg && <div className="sala-mensagem error">{errorMsg}</div>}
          <div className="sala-actions">
            <button
              className="btn btn-danger"
              onClick={handleDesmanchar}
              disabled={loading || actionLoading}
            >
              {isDonoDaSala ? "DESMANCHAR\nSALA" : "SAIR DA\nSALA"}
            </button>
            {isDonoDaSala && (
              <button
                className="btn btn-warning"
                onClick={handleIniciar}
                disabled={ // Atualizado para incluir verificação do WebSocket
                  loading ||
                  actionLoading ||
                  !stompClientRef.current?.active || // Desabilita se WS não está ativo
                  usuarios.length < 1
                }
              >
                INICIAR
              </button>
            )}
          </div>
          <div className="sala-grid">
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((participante) => (
                <div key={participante.id} className="sala-user">
                  <div
                    className="sala-avatar"
                    style={{
                      backgroundImage: participante.avatar
                        ? `url(${participante.avatar})`
                        : undefined,
                    }}
                  />
                  <div
                    className="nome"
                    style={{
                      fontWeight:
                        user && participante.id === user.id ? "bold" : "normal",
                    }}
                  >
                    {participante.nome || "Nome não encontrado"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}