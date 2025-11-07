import React, { useState, useEffect } from "react";
import "./style.css";
import Header from "../../components/header";
import ProtectedRoute from "../../components/ProtectedRoute";
import { usePermissions } from "../../hooks/usePermissions";
import { createFormulario } from "../../services/formularioService";
import verifiedIcon from "../../assets/images/verified.svg";

// --- Componentes RespostaInput e MiniCard (Sem alterações) ---
function RespostaInput({ value, onChange, isCorrect, onSelectCorrect }) {
  return (
    <div className="answer-item">
           {" "}
      <input
        className="answer-input"
        type="text"
        placeholder="INSERIR RESPOSTA"
        value={value}
        onChange={onChange}
      />
           {" "}
      <span
        className={`icon correct${isCorrect ? " selected" : ""}`}
        onClick={onSelectCorrect}
      >
                <img src={verifiedIcon} alt="Correta" />     {" "}
      </span>
         {" "}
    </div>
  );
}
function MiniCard({ selected, onClick, index, pergunta, onDelete }) {
  return (
    <div className={`question-thumb${selected ? " selected" : ""}`}>
           {" "}
      <button
        className="delete-question-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        title="Deletar pergunta"
      >
                ×      {" "}
      </button>
           {" "}
      <div className="mini-question-content" onClick={onClick}>
               {" "}
        <div className="mini-question-text">
                    {pergunta.pergunta || "Pergunta sem texto"}       {" "}
        </div>
               {" "}
        <div className="mini-answers">
                   {" "}
          {pergunta.respostas.map((resposta, idx) => (
            <div
              key={idx}
              className={`mini-answer ${
                resposta.correta
                  ? "correct"
                  : resposta.texto && !resposta.correta
                  ? "incorrect"
                  : "neutral"
              }`}
            >
                           {" "}
              <span className="mini-answer-text">
                                {resposta.texto || `Resposta ${idx + 1}`}       
                     {" "}
              </span>
                           {" "}
              {resposta.correta && (
                <span className="mini-answer-indicator correct">✓</span>
              )}
                         {" "}
            </div>
          ))}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
// --- Componente Principal CreateQuiz ---
export default function CreateQuiz() {
  const { canCreateQuiz, userData, isLoggedIn, userRoles } = usePermissions();

  // ✅ MUDANÇA 1: Defina o novo limite máximo aqui
  const MAX_PERGUNTAS = 10; // (Você pode mudar 10 para 20, 50, etc.)

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState([
    {
      pergunta: "",
      respostas: [
        { texto: "", correta: false },
        { texto: "", correta: false },
        { texto: "", correta: false },
        { texto: "", correta: false },
      ],
    },
  ]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("--- DEBUG (CreateQuiz.js RENDERIZADO) ---");
    console.log("Pode criar quiz?", canCreateQuiz);
  }, [canCreateQuiz]);

  const handlePerguntaChange = (value) => {
    const novas = [...perguntas];
    novas[perguntaAtual].pergunta = value;
    setPerguntas(novas);
  };
  const handleRespostaChange = (rIdx, value) => {
    const novas = [...perguntas];
    novas[perguntaAtual].respostas[rIdx].texto = value;
    setPerguntas(novas);
  };
  const handleSelectResposta = (rIdx) => {
    const novas = [...perguntas];
    novas[perguntaAtual].respostas = novas[perguntaAtual].respostas.map(
      (r, idx) => ({
        ...r,
        correta: idx === rIdx,
      })
    );
    setPerguntas(novas);
  };

  const handleAddPergunta = () => {
    // ✅ MUDANÇA 2: Usa a nova constante
    if (perguntas.length >= MAX_PERGUNTAS) {
      alert(`Você atingiu o limite de ${MAX_PERGUNTAS} perguntas.`);
      return;
    }
    setPerguntas([
      ...perguntas,
      {
        pergunta: "",
        respostas: [
          { texto: "", correta: false },
          { texto: "", correta: false },
          { texto: "", correta: false },
          { texto: "", correta: false },
        ],
      },
    ]);
    setPerguntaAtual(perguntas.length);
  };
  const handleSelectPergunta = (idx) => {
    setPerguntaAtual(idx);
  };
  const handleDeletePergunta = (idx) => {
    if (perguntas.length === 1) {
      alert("O quiz deve ter pelo menos 1 pergunta.");
      return;
    }
    const confirmar = window.confirm(
      "Tem certeza que deseja deletar esta pergunta?"
    );
    if (!confirmar) return;
    const novasPerguntas = perguntas.filter((_, i) => i !== idx);
    setPerguntas(novasPerguntas);
    if (perguntaAtual >= novasPerguntas.length) {
      setPerguntaAtual(novasPerguntas.length - 1);
    } else if (perguntaAtual === idx && idx > 0) {
      setPerguntaAtual(idx - 1);
    }
  }; // --- Lógica de Finalizar Quiz (Sem alterações) ---

  const handleFinalizarQuiz = async () => {
    if (!isLoggedIn) {
      return;
    }
    if (!canCreateQuiz) {
      return;
    }
    if (!titulo.trim()) {
      return;
    }
    if (titulo.length < 3) {
      return;
    }

    const perguntasInvalidas = perguntas.filter((p) => {
      const temRespostaCorreta = p.respostas.some((r) => r.correta);
      const respostasPreenchidas = p.respostas.filter((r) =>
        r.texto.trim()
      ).length;
      return (
        !p.pergunta.trim() || !temRespostaCorreta || respostasPreenchidas < 2
      );
    });
    if (perguntasInvalidas.length > 0) {
      alert(
        "❌ Todas as perguntas devem ter:\n- Texto da pergunta\n- Pelo menos 2 alternativas preenchidas\n- Uma resposta marcada como correta"
      );
      return;
    }

    setLoading(true);

    try {
      const perguntasParaEnviar = perguntas.map((perguntaEstado) => {
        const alternativasParaEnviar = perguntaEstado.respostas
          .filter((r) => r.texto.trim() !== "")
          .map((r) => ({
            textoAlternativa: r.texto,
            correta: r.correta,
          }));

        return {
          textoPergunta: perguntaEstado.pergunta,
          tema: { idTema: 1 },
          alternativas: alternativasParaEnviar,
        };
      });

      const quizData = {
        titulo: titulo,
        descricao: descricao,
        perguntas: perguntasParaEnviar,
      };

      console.log("📝 Enviando JSON completo para /formularios:", quizData);
      const formularioCriado = await createFormulario(quizData);
      const idFormulario = formularioCriado.idFormulario || formularioCriado.id;
      console.log("🎉 Questionário criado com sucesso!", formularioCriado);
      alert(
        `✅ Questionário criado com sucesso!\n\n` +
          `Título: "${titulo}"\n` +
          `Total de perguntas: ${perguntas.length}\n` +
          `ID do formulário: ${idFormulario}`
      );
      setTitulo("");
      setDescricao("");
      setPerguntas([
        {
          pergunta: "",
          respostas: [
            { texto: "", correta: false },
            { texto: "", correta: false },
            { texto: "", correta: false },
            { texto: "", correta: false },
          ],
        },
      ]);
      setPerguntaAtual(0);
    } catch (error) {
      console.error("❌ Erro ao criar questionário:", error);
      let mensagemErro = "❌ Erro ao criar questionário\n\n";
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  }; // --- O JSX ---

  return (
    <ProtectedRoute requiredRole="ROLE_CRIADOR_FORMULARIO">
            <Header />     {" "}
      <div className="quiz-container">
               {" "}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#e8f5e8",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
                    <strong>👤 {userData?.nome || "N/A"}</strong>       {" "}
        </div>
               {" "}
        <div className="sidebar-left">
                   {" "}
          <input
            type="text"
            placeholder="TITULO..."
            className="quiz-title"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
                   {" "}
          <textarea
            placeholder="INSERIR DESCRICAO"
            className="quiz-description"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={40}
          />
                 {" "}
        </div>
               {" "}
        <div className="main-content">
                   {" "}
          <div className="question-card" style={{ position: "relative" }}>
                       {" "}
            <input
              className="question-h2-input"
              type="text"
              value={perguntas[perguntaAtual]?.pergunta || ""}
              onChange={(e) => handlePerguntaChange(e.target.value)}
              placeholder="INSERIR PERGUNTA"
              spellCheck={false}
              autoComplete="off"
            />
                       {" "}
            {perguntas.length > 0 && perguntas[perguntaAtual] && (
              <div className="answers-list">
                               {" "}
                {perguntas[perguntaAtual].respostas.map((resposta, idx) => (
                  <RespostaInput
                    key={idx}
                    value={resposta.texto}
                    onChange={(e) => handleRespostaChange(idx, e.target.value)}
                    isCorrect={resposta.correta}
                    onSelectCorrect={() => handleSelectResposta(idx)}
                  />
                ))}
                             {" "}
              </div>
            )}
                       {" "}
            <button
              className="finalize-quiz-btn"
              onClick={handleFinalizarQuiz}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
                         {" "}
              {loading ? "Criando questionário..." : "Finalizar Questionário"}{" "}
              {/* 'D' removido */}           {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="sidebar-right">
                   {" "}
          {perguntas.map((pergunta, idx) => (
            <MiniCard
              key={idx}
              selected={perguntaAtual === idx}
              onClick={() => handleSelectPergunta(idx)}
              index={idx}
              pergunta={pergunta}
              onDelete={handleDeletePergunta}
            />
          ))}
                   {" "}
          {perguntas.length < MAX_PERGUNTAS && ( // ✅ MUDANÇA 3: Usa a nova constante
            <div className="add-question" onClick={handleAddPergunta}>
              +
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </ProtectedRoute>
  );
}
