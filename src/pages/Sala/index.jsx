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
  const [usuarios, setUsuarios] = useState([]); // Detalhes dos usuários (objetos)
  const [loading, setLoading] = useState(true); // Loading principal da tela
  const [actionLoading, setActionLoading] = useState(false);
  const [salaInfo, setSalaInfo] = useState(null); // Dados brutos da sala (inclui lista de IDs)
  const [isDonoDaSala, setIsDonoDaSala] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Ref para controle de montagem
  const isMountedRef = useRef(true); // Definido como true na inicialização

  // --- 1. FUNÇÃO DE CARGA INICIAL ---
  // Busca a sala E os detalhes dos usuários iniciais (APENAS UMA VEZ)
  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo || !user?.id) return;
    
    // Garante que o componente ainda está montado
    if (!isMountedRef.current) return;
    setLoading(true); // Inicia o loading

    try {
      const sala = await salaService.getSalaByPin(codigo);
      if (!isMountedRef.current || !sala) return;
      
      setSalaInfo(sala);
      setIsDonoDaSala(sala.idUsuario === user.id);

      // Processa a lista inicial de participantes
      const participantesIds = sala.participantes || sala.idParticipantes || [];
      if (participantesIds.length > 0) {
        const userPromises = participantesIds.map((id) => userService.getUserById(id));
        const results = await Promise.allSettled(userPromises);
        if (!isMountedRef.current) return;

        const validUsers = results
          .filter((r) => r.status === "fulfilled" && r.value?.id)
          .map((r) => r.value);
        setUsuarios(validUsers);
      } else {
        setUsuarios([]); // Lista vazia se não houver ninguém
      }

    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      if (isMountedRef.current) {
        setErrorMsg("Falha ao carregar informações da sala.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false); // Para o loading
      }
    }
  }, [codigo, user?.id]); // Depende apenas do código e do usuário

  // --- 2. Conexão WebSocket (LÓGICA ATUALIZADA) ---
  useEffect(() => {
    if (!codigo || !user?.id) return;

    isMountedRef.current = true;
    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
        console.log("WebSocket Conectado.");
        const topic = `/topic/sala/${codigo}`;
        client.subscribe(topic, (message) => {
          if (!isMountedRef.current) return;
          try {
            const payload = JSON.parse(message.body);
            console.log("Mensagem WS recebida:", payload.type);
            
            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", { state: { idFormulario, idSala, codigoSala } });
            
            // --- PARTE 2: ATUALIZA O ESTADO LOCALMENTE ---
            } else if (payload.type === "USUARIO_ENTROU") {
              // Adiciona o novo usuário (que veio no payload) ao estado
              console.log("WS: Usuário entrou", payload.usuario);
              setUsuarios(prevUsuarios => {
                // Previne duplicados
                if (prevUsuarios.find(u => u.id === payload.usuario.id)) {
                  return prevUsuarios;
                }
                return [...prevUsuarios, payload.usuario];
              });
            
            } else if (payload.type === "USUARIO_SAIU") {
              // Remove o usuário (pelo ID) do estado
              console.log("WS: Usuário saiu", payload.idUsuario);
              setUsuarios(prevUsuarios => 
                prevUsuarios.filter(u => u.id !== payload.idUsuario)
              );
            }
          } catch (e) {
            console.error("Erro ao processar mensagem WebSocket:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"]);
        if (isMountedRef.current) setIsConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("Erro WebSocket:", error);
        if (isMountedRef.current) setIsConnected(false);
      },
      onDisconnect: () => {
        if (isMountedRef.current) setIsConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMountedRef.current = false;
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
  }, [codigo, navigate, user?.id]); // Removido 'carregarSala' daqui

  // --- 3. Carga Inicial (POLLING REMOVIDO) ---
  useEffect(() => {
    if (!codigo || !user?.id) {
      navigate("/game");
      return;
    }

    isMountedRef.current = true;
    
    // Chama a função de carga inicial (que agora busca sala E usuários)
    carregarDadosIniciais(); 

    // O setInterval(carregarSala, 5000) foi REMOVIDO.
    
    return () => {
      isMountedRef.current = false;
    };
  }, [codigo, user?.id, carregarDadosIniciais, navigate]); // Roda apenas uma vez

  // --- 4. useEffect para ATUALIZAR USUÁRIOS (REMOVIDO) ---
  // Não é mais necessário.

  // --- 5. Iniciar jogo (Sem alteração) ---
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) {
      setErrorMsg("Não é possível iniciar agora.");
      return;
    }
    setActionLoading(true);
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
      console.error("Erro ao iniciar jogo:", err);
      setErrorMsg("Falha ao enviar comando de início.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 6. Sair ou desmanchar sala (Lógica de ID Corrigida) ---
  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    const confirmMessage = isDonoDaSala
      ? "Deseja desmanchar esta sala?"
      : "Deseja sair desta sala?";
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(true);
    try {
      // Usa salaInfo.idSala (que vem do DTO do backend)
      if (isDonoDaSala) await salaService.fecharSala(salaInfo.idSala);
      else await salaService.sairDaSala(codigo, user.id);
      navigate("/game");
    } catch (err) {
      console.error("Erro ao sair/desmanchar sala:", err);
      const backendError = err.response?.data?.message || err.response?.data;
      setErrorMsg(`Erro: ${backendError || err.message || "Ação falhou."}`);
    } finally {
      setActionLoading(false);
    }
  };

  // === 7. Renderização (JSX 100% LIMPO) ===
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
            {/* Lógica de Loading/Vazio Corrigida */}
            {loading ? (
              <div className="sala-mensagem">Carregando...</div>
            ) : usuarios.length === 0 ? (
              <div className="sala-mensagem">Aguardando jogadores...</div>
            ) : (
              // Se tiver usuários
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