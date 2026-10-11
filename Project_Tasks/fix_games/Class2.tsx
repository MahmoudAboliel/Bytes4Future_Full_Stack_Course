import { useState } from "react";

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const LEN = 4;

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

// build this Function:
// Check if the last move at (row, col) created four in a row
function checkWin(
  board: (number | null)[][],
  row: number,
  col: number,
  player: number,
) {
  let checkRow = 0;
  let checkCol = 0;
  let checkD1 = 0;
  let checkD2 = 0;

  // get col
  const mycol = board[row];
  for (const c of mycol) {
    if (c === player) {
      checkCol += 1;
      if (checkCol === LEN) return true;
    } else {
      checkCol = 0;
    }
  }

  // get row
  const myrow = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (j === col) {
        myrow.push(board[i][j]);
      }
    }
  }
  for (const r of myrow) {
    if (r === player) {
      checkRow += 1;
      if (checkRow === LEN) return true;
    } else {
      checkRow = 0;
    }
  }

  // get d1
  const myd1 = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (i + j === row + col) {
        myd1.push(board[i][j]);
      }
    }
  }
  for (const d1 of myd1) {
    if (d1 === player) {
      checkD1 += 1;
      if (checkD1 === LEN) return true;
    } else {
      checkD1 = 0;
    }
  }

  // get d2
  const myd2 = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (i - j === row - col) {
        myd2.push(board[i][j]);
      }
    }
  }
  for (const d2 of myd2) {
    if (d2 === player) {
      checkD2 += 1;
      if (checkD2 === LEN) return true;
    } else {
      checkD2 = 0;
    }
  }

  return false;
}

export default function Class2() {
  const [board, setBoard] = useState<(number | null)[][]>(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const handleColumnClick = (col: number) => {
    if (winner || isDraw) return;

    // Find the lowest empty row in this column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) {
        row = r;
        break;
      }
    }
    if (row === -1) return; // column is full

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    const hasWon = checkWin(newBoard, row, col, currentPlayer);
    const isFull = newBoard.every((r) => r.every((cell) => cell !== EMPTY));

    setBoard(newBoard);

    if (hasWon) {
      setWinner(currentPlayer);
    } else if (isFull) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setIsDraw(false);
  };

  const getStatus = () => {
    if (winner) return `Player ${winner} wins! 🎉`;
    if (isDraw) return "It's a draw! 🤝";
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        minHeight: "100vh",
        background: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>Connect Four</h1>
      <p style={{ margin: "0 0 20px", color: "#475569", fontSize: 16 }}>
        {getStatus()}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 60px)`,
          gap: 6,
          background: "#1e3a8a",
          padding: 10,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleColumnClick(c)}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  cell === 1 ? "#ef4444" : cell === 2 ? "#facc15" : "#e2e8f0",
                cursor: winner || isDraw ? "default" : "pointer",
                transition: "background 0.15s",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          )),
        )}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: 24,
          padding: "10px 24px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          background: "#2563eb",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Reset Game
      </button>
    </div>
  );
}
