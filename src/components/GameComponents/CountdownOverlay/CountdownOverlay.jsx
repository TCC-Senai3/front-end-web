import React, { useEffect, useState } from "react";
import "./CountdownOverlay.css";

export default function CountdownOverlay({ onComplete, segundos = 3 }) {
  const [count, setCount] = useState(segundos);

  useEffect(() => {
    // Se chegou a 0, avisa o componente pai que acabou
    if (count === 0) {
      onComplete();
      return;
    }

    // Diminui 1 a cada segundo
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count === 0) return null; // Não renderiza nada se acabou

  return (
    <div className="countdown-overlay">
      <div className="countdown-text">Próxima pergunta em...</div>
      <div className="countdown-number">{count}</div>
    </div>
  );
}