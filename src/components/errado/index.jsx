import React from "react";
import "./style.css";
import cancelIcon from "../../assets/images/Error.svg";

export default function errado() {
  return (
    <div className="corretopage-bg">
      <img src={cancelIcon} alt="errada" className="cancel-icon" />
    </div>
  );
}
