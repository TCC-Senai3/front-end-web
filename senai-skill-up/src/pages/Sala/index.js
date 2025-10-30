import React, { useState, useEffect, useRef } from "react";
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

  // === 1. Conexão WebSocket ===
  useEffect(() => {
    if (!codigo || !user?.id) return;

    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        const topic = `/topic/sala/${codigo}`;
        client.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", { state: { idFormulario, idSala, codigoSala } });
            } else if (payload.type === "USUARIO_ENTROU" || payload.type === "USUARIO_SAIU") {
              carregarUsuarios();
            }
          } catch (e) {
            console.error("Erro ao processar mensagem WebSocket:", e, message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
        setErrorMsg("Erro de comunicação com o servidor.");
        setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("Erro WebSocket:", error);
        setErrorMsg("Erro de conexão WebSocket. Tentando reconectar...");
        setIsConnected(false);
      },
      onDisconnect: () => setIsConnected(false),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
  }, [codigo, navigate, user?.id]);

  // === 2. Carregar informações da sala ===
  useEffect(() => {
    if (!codigo || !user?.id) return;
    let isMounted = true;

    async function carregarSala() {
      try {
        const sala = await salaService.getSalaByPin(codigo);
        if (!isMounted || !sala) return;
        setSalaInfo(sala);
        setIsDonoDaSala(sala.idUsuario === user.id);
      } catch (err) {
        console.error("Erro ao carregar sala:", err);
        setErrorMsg("Falha ao carregar informações da sala.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    carregarSala();
    return () => { isMounted = false; };
  }, [codigo, user?.id]);

  // === 3. Carregar usuários (polling) ===
  async function carregarUsuarios() {
    if (!salaInfo) return;

    try {
      let participantesIds = salaInfo.participantes || salaInfo.idParticipantes || [];
      if (participantesIds.length === 0) {
        setUsuarios([]);
        return;
      }

      const userPromises = participantesIds.map((id) => userService.getUserById(id));
      const results = await Promise.allSettled(userPromises);

      const validUsers = results
        .filter((r) => r.status === "fulfilled" && r.value?.id)
        .map((r) => r.value);

      setUsuarios(validUsers);

      results
        .filter((r) => r.status === "rejected")
        .forEach((r) => console.error("Erro ao buscar usuário:", r.reason));
    } catch (err) {
      console.error("Erro ao carregar usuários da sala:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!codigo) return;
    carregarUsuarios();
    const interval = setInterval(carregarUsuarios, 5000);
    return () => clearInterval(interval);
  }, [codigo, salaInfo]);

  // === 4. Botão "Iniciar" ===
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !stompClientRef.current?.active) {
      setErrorMsg("Não é possível iniciar. Verifique a conexão ou se você é dono da sala.");
      return;
    }

    setActionLoading(true);
    setErrorMsg("");
    try {
      // Agora enviamos idUsuario no payload
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

  // === 5. Botão "Desmanchar / Sair" ===
  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      if (isDonoDaSala) {
        await salaService.fecharSala(salaInfo.idSala);
      } else {
        await salaService.sairDaSala(codigo, user.id);
      }
      navigate("/home");
    } catch (err) {
      console.error("Erro ao sair/desmanchar sala:", err);
      setErrorMsg("Erro ao sair da sala.");
    } finally {
      setActionLoading(false);
    }
  };

  // === Renderização ===
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
                disabled={loading || actionLoading || usuarios.length < 1 || !isConnected}
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
                      fontWeight: participante.id === user.id ? "bold" : "normal",
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
