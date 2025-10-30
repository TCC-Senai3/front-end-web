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
    if (!codigo || !user?.id) {
      console.log("WebSocket: Aguardando código da sala e usuário...");
      return;
    }

    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";
    console.log("Sala.js: Configurando conexão WebSocket...");
    setIsConnected(false);

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("WebSocket Conectado via STOMP:", frame);
        setIsConnected(true);
        setErrorMsg("");

        const topic = `/topic/sala/${codigo}`;
        console.log(`Inscrevendo-se em ${topic}`);
        client.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log(`Mensagem recebida em ${topic}:`, payload);

            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", {
                state: { idFormulario, idSala, codigoSala },
              });
            } else if (
              payload.type === "USUARIO_ENTROU" ||
              payload.type === "USUARIO_SAIU"
            ) {
              carregarUsuarios();
            }
          } catch (e) {
            console.error(
              "Erro ao processar mensagem WebSocket:",
              e,
              message.body
            );
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
      onDisconnect: () => {
        console.log("WebSocket Desconectado");
        setIsConnected(false);
      },
    });

    console.log("Ativando cliente WebSocket...");
    client.activate();
    stompClientRef.current = client;

    return () => {
      console.log("Sala.js: Limpeza - Desativando cliente WebSocket...");
      setIsConnected(false);
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
        console.log("Cliente WebSocket desativado.");
      }
    };
  }, [codigo, user?.id, navigate]);

  // === 2. Carregar informações da sala ===
  useEffect(() => {
    if (!codigo || !user?.id) return;

    async function carregarSala() {
      try {
        const sala = await salaService.getSalaByPin(codigo);
        console.log("Sala carregada:", sala);
        setSalaInfo(sala);
        setIsDonoDaSala(sala.idUsuario === user.id);
      } catch (err) {
        console.error("Erro ao carregar sala:", err);
        setErrorMsg("Falha ao carregar informações da sala.");
      } finally {
        setLoading(false);
      }
    }

    carregarSala();
  }, [codigo, user?.id]);

  // === 3. Buscar usuários periodicamente ===
  async function carregarUsuarios() {
    if (!codigo) return;
    try {
      const response = await userService.listarUsuariosPorSala(codigo);
      console.log("Usuários da sala:", response);
      setUsuarios(response);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!codigo) return;
    carregarUsuarios();

    const interval = setInterval(carregarUsuarios, 5000);
    return () => clearInterval(interval);
  }, [codigo]);

  // === 4. Botão "Iniciar" ===
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) {
      const motivoErro = !isConnected
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
      console.log(`Publicando mensagem 'iniciar' para ${destination}`);

      if (!stompClientRef.current?.connected) {
        throw new Error("Não conectado ao STOMP. Aguarde a conexão.");
      }

      stompClientRef.current.publish({ destination });
    } catch (error) {
      console.error("Erro ao publicar mensagem 'iniciar':", error);
      setErrorMsg(error.message || "Falha ao enviar comando de início.");
      setActionLoading(false);
    }
  };

  // === 5. Botão "Desmanchar / Sair" ===
  const handleDesmanchar = async () => {
    if (!salaInfo) return;
    setActionLoading(true);
    try {
      if (isDonoDaSala) {
        // 🔧 ALTERADO: agora usa fecharSala (compatível com salaService.js)
        await salaService.fecharSala(salaInfo.idSala);
      } else {
        // 🔧 ALTERADO: parâmetros na ordem correta (codigo, idUsuario)
        await salaService.sairDaSala(codigo, user.id);
      }
      navigate("/home");
    } catch (err) {
      console.error("Erro ao sair da sala:", err);
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
                disabled={
                  loading ||
                  actionLoading ||
                  !isConnected ||
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
