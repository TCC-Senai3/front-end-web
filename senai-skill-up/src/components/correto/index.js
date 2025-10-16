import React from "react";
import "./style.css";
import Header from "../../components/header";
import verifiedIcon from "../../assets/images/verified.svg";

export default function correto() {
  return (
    <div>
      <Header />
      <div className="corretopage-bg">
        <img src={verifiedIcon} alt="Correta" className="correta-icon" />
      </div>
    </div>
  );
}
