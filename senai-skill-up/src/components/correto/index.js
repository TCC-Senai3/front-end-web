import React from "react";
import "./style.css";
import Header_padrao from "../../components/Header_padrao";
import verifiedIcon from "../../assets/images/verified 1.png";

export default function correto() {
  return (
    <div>
      <Header_padrao />
      <div className="corretopage-bg">
        <img src={verifiedIcon} alt="Correta" className="correta-icon" />
      </div>
    </div>
  );
}
