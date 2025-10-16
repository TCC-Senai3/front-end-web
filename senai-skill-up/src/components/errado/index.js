import React from "react";
import "./style.css";
import Header from "../../components/header";
import cancelIcon from "../../assets/images/Error.svg";

export default function errado() {
  return (
    <div>
      <Header />
      <div className="corretopage-bg">
        <img src={cancelIcon} alt="errada" className="cancel-icon" />
      </div>
    </div>
  );
}
