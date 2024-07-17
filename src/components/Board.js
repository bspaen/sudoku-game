// src/components/Board.js
import React from "react";
import Cell from "./Cell";
import "./Board.css";

const Board = ({ board, errors, onCellClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          let className = "cell";
          if ((colIndex + 1) % 3 === 0 && colIndex !== 8)
            className += " right-border";
          if ((rowIndex + 1) % 3 === 0 && rowIndex !== 8)
            className += " bottom-border";
          if (
            errors.some(
              (error) => error.row === rowIndex && error.col === colIndex
            )
          )
            className += " error";

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              className={className}
              onClick={(e) => onCellClick(rowIndex, colIndex, e)}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
