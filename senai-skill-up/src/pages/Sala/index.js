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

  // Função para carregar informações da sala
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

  // Conexão WebSocket
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
            } else if (
              payload.type === "USUARIO_ENTROU" ||
              payload.type === "USUARIO_SAIU"
            ) {
              carregarSala(isMountedRef);
            }
          } catch (e) {
            console.error("Erro ao processar mensagem WebSocket:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"]);
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("Erro WebSocket:", error);
        setIsConnected(false);
      },
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

  // Polling e carga inicial
  useEffect(() => {
    if (!codigo || !user?.id) {
      navigate("/game");
      return;
    }
    const isMountedRef = { current: true };

    if (!salaInfo) setLoading(true);
    carregarSala(isMountedRef);
    const interval = setInterval(() => carregarSala(isMountedRef), 5000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [codigo, user?.id, carregarSala, navigate, salaInfo]);

  // Atualizar usuários ao mudar salaInfo
  useEffect(() => {
    if (!salaInfo) return;
    const isMountedRef = { current: true };

    async function carregarUsuarios() {
      try {
        const participantesIds =
          salaInfo.participantes || salaInfo.idParticipantes || [];
        if (participantesIds.length === 0) {
          setUsuarios([]);
          if (loading) setLoading(false);
          return;
        }

        const userPromises = participantesIds.map((id) =>
          userService.getUserById(id)
        );
        const results = await Promise.allSettled(userPromises);
        if (!isMountedRef.current) return;

        const validUsers = results
          .filter((r) => r.status === "fulfilled" && r.value?.id)
          .map((r) => r.value);
        setUsuarios(validUsers);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar usuários da sala:", err);
        if (isMountedRef.current) setLoading(false);
      }
    }

    carregarUsuarios();
    return () => {
      isMountedRef.current = false;
    };
  }, [salaInfo]);

  // Iniciar jogo
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) {
      setErrorMsg("Não é possível iniciar agora.");
      return;
    }
    setActionLoading(true);
    try {
      const destination = `/app/sala/${codigo}/iniciar`;
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify({ idUsuario: user.id }),
      });
    } catch (err) {
      console.error("Erro ao iniciar jogo:", err);
      setErrorMsg("Falha ao enviar comando de início.");
    } finally {
      setActionLoading(false);
    }
  };

  // Sair ou desmanchar sala
  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    const confirmMessage = isDonoDaSala
      ? "Deseja desmanchar esta sala?"
      : "Deseja sair desta sala?";
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(true);
    try {
      if (isDonoDaSala) await salaService.fecharSala(salaInfo.idSala);
      else await salaService.sairDaSala(codigo, user.id);
      navigate("/game");
    } catch (err) {
      console.error("Erro ao sair/desmanchar sala:", err);
      setErrorMsg("Ação falhou. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

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
              {isDonoDaSala ? "DESMANCHAR SALA" : "SAIR DA SALA"}
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
            {loading && usuarios.length === 0 ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              usuarios.map((p) => (
                <div key={p.id} className="sala-user">
                  <div
                    className="sala-avatar"
                    style={{
                      backgroundImage: p.avatar ? `url(${p.avatar})` : undefined,
                    }}
                  />
                  <div
                    className="nome"
                    style={{
                      fontWeight: user && p.id === user.id ? "bold" : "normal",
                    }}
                  >
                    {p.nome || "Jogador"}
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
