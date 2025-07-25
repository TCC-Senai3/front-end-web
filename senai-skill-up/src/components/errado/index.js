import React from "react";
import "./style.css";
import Header_padrao from "../../components/Header_padrao";
import cancelIcon from "../../assets/images/cancel 1.png";

export default function errado() {
  return (
    <div>
      <Header_padrao />
      <div className="corretopage-bg">
        <img src={cancelIcon} alt="errada" className="cancel-icon" />
      </div>
    </div>
  );
}
