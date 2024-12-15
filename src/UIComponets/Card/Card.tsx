import React from "react";
import { CardProps } from "./CardProps";
import "./Card.css";

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <div className="card-container" style={style}>
      {children}
    </div>
  );
};

export default Card;