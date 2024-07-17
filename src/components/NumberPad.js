// src/components/NumberPad.js
import React from "react";
import "./NumberPad.css";

const NumberPad = ({ position, onSelect, onClose }) => {
  return (
    <div
      className="number-pad"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="number-pad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => onSelect(num)}>
            {num}
          </button>
        ))}
        <button onClick={() => onSelect("")}>Clear</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NumberPad;
