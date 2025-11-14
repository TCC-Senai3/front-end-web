import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import salaService from "../../services/salaService";
import userService from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./style.css";

// --- 1. IMPORTAÇÃO DAS IMAGENS ---
import userProfileImage from "../../assets/images/user-profile1.png"; // Imagem padrão
import bodeIcon from "../../assets/images/bode.svg";
import canetaIcon from "../../assets/images/Canetabic.svg";
import patoIcon from "../../assets/images/Pato.svg";

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

  const isMountedRef = useRef(true);

  // --- 2. MAPA DE AVATARES ---
  const avatarMap = {
    "bode.svg": bodeIcon, "bode": bodeIcon,
    "Canetabic.svg": canetaIcon, "caneta": canetaIcon,
    "Pato.svg": patoIcon, "pato": patoIcon,
  };

  // --- FUNÇÃO AUXILIAR PARA PEGAR O SRC CORRETO ---
  const getAvatarSrc = (avatarString) => {
    if (!avatarString) return userProfileImage;
    const cleanName = avatarString.trim();
    // Verifica se é Base64/URL ou nome mapeado
    if (cleanName.startsWith("data:") || cleanName.startsWith("http")) {
      return cleanName;
    }
    return avatarMap[cleanName] || userProfileImage;
  };

  // --- 3. CARGA INICIAL DA SALA ---
  const carregarDadosIniciais = useCallback(async () => {
    if (!codigo || !user?.id) return;
    if (!isMountedRef.current) return;
    setLoading(true);

    try {
      const sala = await salaService.getSalaByPin(codigo);
      if (!isMountedRef.current || !sala) return;
      
      setSalaInfo(sala);
      setIsDonoDaSala(sala.idUsuario === user.id);

      const participantesIds = sala.participantes || sala.idParticipantes || [];
      if (participantesIds.length > 0) {
        // Busca os dados completos (incluindo avatar) de cada ID
        const userPromises = participantesIds.map((id) => userService.getUserById(id));
        const results = await Promise.allSettled(userPromises);
        
        if (!isMountedRef.current) return;

        const validUsers = results
          .filter((r) => r.status === "fulfilled" && r.value?.id)
          .map((r) => r.value);
        setUsuarios(validUsers);
      } else {
        setUsuarios([]);
      }

    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      if (isMountedRef.current) setErrorMsg("Falha ao carregar informações da sala.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [codigo, user?.id]);

  // --- 4. WEBSOCKET (AQUI ESTÁ A MÁGICA) ---
  useEffect(() => {
    if (!codigo || !user?.id) return;

    isMountedRef.current = true;
    // Ajuste a URL se necessário (http vs https)
    const socketUrl = "https://tccdrakes.azurewebsites.net/ws";

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
        console.log("WebSocket Conectado na Sala:", codigo);
      
        const topic = `/topic/sala/${codigo}`;
        client.subscribe(topic, (message) => {
          if (!isMountedRef.current) return;
          try {
            const payload = JSON.parse(message.body);
            console.log("WS Message:", payload);
          
            if (payload.type === "JOGO_INICIADO") {
              const { idFormulario, idSala, codigoSala } = payload;
              navigate("/jogo", { state: { idFormulario, idSala, codigoSala } });
            
            } else if (payload.type === "USUARIO_ENTROU") {
              // =====================================================
              // CORREÇÃO AQUI:
              // 1. Adiciona o usuário imediatamente (pode vir sem avatar do socket)
              const novoUsuario = payload.usuario;
              
              setUsuarios(prev => {
                if (prev.find(u => u.id === novoUsuario.id)) return prev;
                return [...prev, novoUsuario];
              });

              // 2. FORÇA UMA ATUALIZAÇÃO: Busca o usuário completo na API
              // Isso garante que o avatar correto apareça mesmo se o Socket falhar nisso.
              userService.getUserById(novoUsuario.id).then(fullUser => {
                 if (isMountedRef.current && fullUser) {
                    setUsuarios(prev => prev.map(u => 
                        u.id === fullUser.id ? fullUser : u // Substitui pelo completo
                    ));
                 }
              }).catch(err => console.error("Erro ao atualizar avatar via API:", err));
              // =====================================================
            
            } else if (payload.type === "USUARIO_SAIU") {
              setUsuarios(prev => prev.filter(u => u.id !== payload.idUsuario));
            }
          } catch (e) {
            console.error("Erro no WebSocket:", e);
          }
        });
      },
      onStompError: (frame) => console.error("Erro STOMP:", frame.headers["message"]),
      onWebSocketError: (err) => console.error("Erro WebSocket:", err),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMountedRef.current = false;
      if (stompClientRef.current?.active) stompClientRef.current.deactivate();
      setIsConnected(false);
    };
  }, [codigo, navigate, user?.id]);

  // Trigger Carga Inicial
  useEffect(() => {
    if (!codigo || !user?.id) {
      navigate("/game");
      return;
    }
    isMountedRef.current = true;
    carregarDadosIniciais(); 
    return () => { isMountedRef.current = false; };
  }, [codigo, user?.id, carregarDadosIniciais, navigate]);

  // Actions
  const handleIniciar = async () => {
    if (!salaInfo || !isDonoDaSala || actionLoading || !isConnected) return;
    setActionLoading(true);
    try {
      const destination = `/app/sala/${codigo}/iniciar`;
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify({ idUsuario: user.id }),
      });
    } catch (err) {
      console.error("Erro ao iniciar:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesmanchar = async () => {
    if (!salaInfo || !user) return;
    if (!window.confirm(isDonoDaSala ? "Desmanchar sala?" : "Sair da sala?")) return;

    setActionLoading(true);
    try {
      if (isDonoDaSala) await salaService.fecharSala(salaInfo.idSala);
      else await salaService.sairDaSala(codigo, user.id);
      navigate("/game");
    } catch (err) {
      setErrorMsg("Erro ao sair.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- 5. RENDERIZAÇÃO ---
  return (
    <>
      <Header />
      <div className="sala-container">
        <div className="sala-content">
          <div className="sala-codigo">CODE: {codigo || "ERRO"}</div>
          {errorMsg && <div className="sala-mensagem error">{errorMsg}</div>}

          <div className="sala-actions">
            <button className="btn btn-danger" onClick={handleDesmanchar} disabled={actionLoading || !salaInfo}>
              {isDonoDaSala ? "DESMANCHAR SALA" : "SAIR DA SALA"}
            </button>
            {isDonoDaSala && (
              <button className="btn btn-warning" onClick={handleIniciar} disabled={loading || actionLoading || usuarios.length < 1 || !isConnected}>
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
              usuarios.map((participante) => {
                const avatarSrc = getAvatarSrc(participante.avatar);
                
                return (
                  <div key={participante.id} className="sala-user">
                    {/* Container do Avatar */}
                    <div className="sala-avatar">
                        <img 
                          src={avatarSrc} 
                          alt={participante.nome} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            borderRadius: '50%', 
                            objectFit: 'cover' 
                          }} 
                        />
                    </div>

                    <div className="nome" style={{ fontWeight: user && participante.id === user.id ? "bold" : "normal", marginTop: '8px' }}>
                      {participante.nome || "Jogador"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}