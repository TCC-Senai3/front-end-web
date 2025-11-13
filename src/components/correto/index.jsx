import React from "react";
import "./style.css";
import verifiedIcon from "../../assets/images/verified.svg";

export default function correto() {
  return (
    <div className="corretopage-bg">
      <img src={verifiedIcon} alt="Correta" className="correta-icon" />
    </div>
  );
}
