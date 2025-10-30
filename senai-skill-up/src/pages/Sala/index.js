import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
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
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // --- 1. FUNÇÃO REUTILIZÁVEL PARA BUSCAR DADOS DA SALA ---
  const carregarSala = useCallback(async (isMountedRef) => {
    if (!codigo || !user?.id) return;
    try {
      const sala = await salaService.getSalaByPin(codigo);
      if (!isMountedRef.current || !sala) return;
      setSalaInfo(sala);
      setIsDonoDaSala(sala.idUsuario === user.id);
    } catch (err) {
      console.error("Erro ao carregar sala:", err);
      if (isMountedRef.current) {
        setErrorMsg("Falha ao carregar informações da sala.");
      }
    }
  }, [codigo, user?.id]);


  // --- 2. Conexão WebSocket ---
  useEffect(() => {
    if (!codigo || !user?.id) return;
    const isMountedRef = { current: true };
    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.log("WebSocket Conectado.");
        const topic = `/topic/sala/${codigo}`;
        client.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log("Mensagem WS recebida:", payload.type);
            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", { state: { idFormulario, idSala, codigoSala } });
            } else if (payload.type === "USUARIO_ENTROU" || payload.type === "USUARIO_SAIU") {
              console.log("WebSocket: " + payload.type + ". Recarregando dados da sala.");
              carregarSala(isMountedRef);
            }
          } catch (e) { console.error("Erro ao processar mensagem WebSocket:", e); }
        });
      },
      onStompError: (frame) => { console.error("Erro STOMP:", frame.headers["message"]); setIsConnected(false); },
      onWebSocketError: (error) => { console.error("Erro WebSocket:", error); setIsConnected(false); },
      onDisconnect: () => setIsConnected(false),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMountedRef.current = false;
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
  }, [codigo, navigate, user?.id, carregarSala]);

  // === 3. POLLING e Carga Inicial ===
  useEffect(() => {
    if (!codigo || !user?.id) {
      navigate("/game");
      return;
    }
    const isMountedRef = { current: true };

    // Só define loading=true na carga inicial (quando salaInfo é null)
    if (!salaInfo) {
      setLoading(true);
    }
    carregarSala(isMountedRef);

    const interval = setInterval(() => {
      carregarSala(isMountedRef); // Polling
    }, 5000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [codigo, user?.id, carregarSala, navigate, salaInfo]); // Adicionado salaInfo

  // === 4. useEffect para ATUALIZAR USUÁRIOS (Sempre que 'salaInfo' mudar) ===
  useEffect(() => {
    if (!salaInfo) return;

    const isMountedRef = { current: true };

    async function carregarUsuarios() {
      if (!isMountedRef.current) return;

      // Define o loading=true ANTES de começar a buscar os usuários
      // Isso garante que o estado "Carregando..." apareça se a busca demorar
      setLoading(true);

      try {
        let participantesIds = salaInfo.participantes || salaInfo.idParticipantes || [];
        const currentIds = usuarios.map(u => u.id).sort().join(',');
        const newIds = [...participantesIds].sort().join(',');

        if (currentIds === newIds) {
          setLoading(false); // Lista é a mesma, para o loading
          return;
        }

        if (participantesIds.length === 0) {
          setUsuarios([]);
        } else {
          const userPromises = participantesIds.map((id) => userService.getUserById(id));
          const results = await Promise.allSettled(userPromises);
          if (!isMountedRef.current) return;

          const validUsers = results
            .filter((r) => r.status === "fulfilled" && r.value?.id)
            .map((r) => r.value);
          setUsuarios(validUsers);

          results.filter((r) => r.status === "rejected")
            .forEach((r) => console.error("Erro ao buscar usuário:", r.reason));
        }
      } catch (err) {
        console.error("Erro ao carregar usuários da sala:", err);
      } finally {
        if (isMountedRef.current) setLoading(false); // Para o loading após processar
      }
    }

    carregarUsuarios(); // Chama a função

    return () => { isMountedRef.current = false; };

    // *** CORREÇÃO DO LOOP: Removido 'loading' da dependência ***
  }, [salaInfo]); // <<< Depende APENAS de salaInfo


  // === 5. Botão "Iniciar" ===
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) {
      setErrorMsg("Não é possível iniciar. Verifique a conexão ou se você é dono da sala.");
      return;
    }
    setActionLoading(true);
    setErrorMsg("");
    try {
      if (!stompClientRef.current?.connected) {
        throw new Error("Cliente STOMP não conectado.");
      }
      const destination = `/app/sala/${codigo}/iniciar`;
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify({ idUsuario: user.id }),
      });
    } catch (err) {
      console.error("Erro ao publicar mensagem 'iniciar':", err);
      setErrorMsg("Falha ao enviar comando de início.");
    } finally {
      setActionLoading(false);
    }
  };

  // === 6. Botão "Desmanchar / Sair" ===
  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    const confirmMessage = isDonoDaSala ? "Desmanchar esta sala para todos?" : "Sair desta sala?";
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(true);
    setErrorMsg("");
    try {
      if (isDonoDaSala) {
        await salaService.fecharSala(salaInfo.idSala);
      } else {
        await salaService.sairDaSala(codigo, user.id);
      }
      navigate("/game");
    } catch (err) {
      console.error("Erro ao sair/desmanchar sala:", err);
      const backendError = err.response?.data?.message || err.response?.data;
      setErrorMsg(`Erro: ${backendError || err.message || "Ação falhou."}`);
      setActionLoading(false);
    }
  };

  // === 7. Renderização (JSX Corrigido) ===
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
              disabled={actionLoading || !salaInfo}
            >
              {isDonoDaSala ? "DESMANCHAR\nSALA" : "SAIR DA\nSALA"}
            </button>

            {isDonoDaSala && (
              <button
                className="btn btn-warning"
                onClick={handleIniciar}
                disabled={loading || actionLoading || usuarios.length < 1 || !isConnected}
              >
                INICIAR
              </button>
            )}
          </div>

          <div className="sala-grid">
            {/* Lógica de Loading/Vazio Corrigida */}
            {loading && usuarios.length === 0 ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : !loading && usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              // Se tiver usuários (mesmo que 'loading' esteja true por um refresh)
              usuarios.map((participante) => (
                <div key={participante.id} className="sala-user">
                  <div
                    className="sala-avatar"
                    // Corrigido: Removido ' _ ' e '...'
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
                        // Corrigido: Removido '...'
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