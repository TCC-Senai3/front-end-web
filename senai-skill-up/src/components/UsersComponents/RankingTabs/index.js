import React from 'react';
import './style.css';

export default function RankingTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'pontos', label: 'PONTOS' },
    { id: 'nome', label: 'NOME' },
    { id: 'posicao', label: 'POSIÇÃO' },
    { id: 'status', label: 'STATUS' }
  ];

  return (
    <div className="ranking-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}



