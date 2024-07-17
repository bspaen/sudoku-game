// src/components/Cell.js
import React from "react";
import "./Cell.css";

const Cell = ({ value, onClick, className }) => {
  return (
    <input
      className={`cell ${className}`}
      type="text"
      value={value}
      onClick={onClick}
      readOnly
    />
  );
};

export default Cell;
