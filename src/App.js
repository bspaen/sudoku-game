// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import Board from "./components/Board";
import NumberPad from "./components/NumberPad";
import Timer from "./components/Timer";
import "./App.css";
import "./components/Timer.css";
import sudoku from "sudoku";

const generateNewBoard = () => {
  const newPuzzle = sudoku.makepuzzle();
  const formattedPuzzle = newPuzzle.map((value) =>
    value === null ? "" : value + 1
  );
  let board = [];
  while (formattedPuzzle.length) board.push(formattedPuzzle.splice(0, 9));
  return board;
};

const checkBoard = (board) => {
  const isValidSet = (set) =>
    new Set(set.filter((n) => n !== "")).size ===
    set.filter((n) => n !== "").length;

  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map((row) => row[i]);
    if (!isValidSet(row) || !isValidSet(col)) return false;
  }

  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      const square = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          square.push(board[i + x][j + y]);
        }
      }
      if (!isValidSet(square)) return false;
    }
  }
  return true;
};

const isBoardComplete = (board) => board.flat().every((cell) => cell !== "");

function App() {
  const [board, setBoard] = useState(generateNewBoard());
  const [errors, setErrors] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [numberPadPosition, setNumberPadPosition] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (isBoardComplete(board)) {
      setIsComplete(checkBoard(board));
      setRunning(false);
    } else {
      setIsComplete(false);
    }
  }, [board]);

  useEffect(() => {
    setRunning(true);
  }, []);

  const handleCellChange = (rowIndex, colIndex, newValue) => {
    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? newValue : cell
      )
    );
    setBoard(newBoard);

    if (!checkBoard(newBoard)) {
      setErrors((prevErrors) => [
        ...prevErrors,
        { row: rowIndex, col: colIndex },
      ]);
    } else {
      setErrors([]);
    }
  };

  const handleNewGame = () => {
    setBoard(generateNewBoard());
    setErrors([]);
    setIsComplete(false);
    setTime(0);
    setRunning(true);
  };

  const handleCellClick = (rowIndex, colIndex, event) => {
    const rect = event.target.getBoundingClientRect();
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    // Adjust position to stay within window boundaries
    const numberPadHeight = 220; // Adjust according to your NumberPad height
    const numberPadWidth = 120; // Adjust according to your NumberPad width
    const padding = 10;

    if (top + numberPadHeight + padding > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - numberPadHeight - padding;
    }

    if (left + numberPadWidth + padding > window.innerWidth + window.scrollX) {
      left = window.innerWidth + window.scrollX - numberPadWidth - padding;
    }
    if (left < 0) {
      left = padding;
    }
    if (top < 0) {
      top = padding;
    }

    setNumberPadPosition({ top, left });
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const handleNumberSelect = (number) => {
    handleCellChange(selectedCell.row, selectedCell.col, number);
    setNumberPadPosition(null);
  };

  const handleCloseNumberPad = () => {
    setNumberPadPosition(null);
  };

  const handleStart = useCallback(() => {
    setTime((prevTime) => prevTime + 1);
  }, []);

  const handlePause = useCallback(() => {
    setRunning(false);
  }, []);

  return (
    <div className="App">
      <h1>Sudoku Game</h1>
      <Board board={board} errors={errors} onCellClick={handleCellClick} />
      <div className="controls">
        <button onClick={handleNewGame} className="new-game-button">
          New Game
        </button>
        <Timer
          time={time}
          running={running}
          onStart={handleStart}
          onPause={handlePause}
        />
      </div>
      {isComplete && (
        <div className="congratulations-popup">
          Congratulations! You've completed the puzzle!
        </div>
      )}
      {numberPadPosition && (
        <NumberPad
          position={numberPadPosition}
          onSelect={handleNumberSelect}
          onClose={handleCloseNumberPad}
        />
      )}
    </div>
  );
}

export default App;
