import { useState, type KeyboardEvent } from "react";

// 0 = path, 1 = wall, 2 = goal
const initialMaze: number[][] = [
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 0, 1, 2],
];

export default function Class1() {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [won, setWon] = useState<boolean>(false);

  // build this Function:
  const movePlayer = (dx: number, dy: number) => {
    const { x, y } = position;
    
    if (
      won ||
      x + dx < 0 ||
      y + dy < 0 ||
      initialMaze[y + dy][x + dx] === 1 ||
      initialMaze[y + dy][x + dx] == undefined
    ) {
      return;
    }

    if (initialMaze[y + dy][x + dx] === 2) {
      setPosition({ x: x + dx, y: y + dy });
      setWon(true);
    } else {
      setPosition({ x: x + dx, y: y + dy });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  };

  // build this Function:
  const resetGame = () => {
    setPosition({ x: 0, y: 0 });
    setWon(false);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        outline: "none",
        textAlign: "center",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <h2>Simple React Maze</h2>{" "}
      <p>
        Use arrow keys to move to the green goal (🏁)! Click inside the box
        first.{" "}
      </p>{" "}
      <div
        style={{
          display: "inline-block",
          border: "2px solid #333",
          backgroundColor: "#f9f9f9",
        }}
      >
        {" "}
        {initialMaze.map((row, y) => (
          <div key={y} style={{ display: "flex" }}>
            {" "}
            {row.map((cell, x) => {
              const isPlayer = position.x === x && position.y === y;
            //   let content = "";
              let bg = "#fff";

              if (cell === 1) bg = "#333"; // Wall
              if (cell === 2) bg = "#d4edda"; // Goal area
              if (isPlayer) bg = "#cce5ff"; // Player trail

              return (
                <div
                  key={x}
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: bg,
                    border: "1px solid #ddd",
                    fontSize: "20px",
                  }}
                >
                  {isPlayer ? "👤" : cell === 2 ? "🏁" : ""}{" "}
                </div>
              );
            })}{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {won && <p style={{ color: "green", fontWeight: "bold" }}>You Won! 🎉</p>}{" "}
      <div style={{ marginTop: "15px" }}>
        {" "}
        <button
          onClick={resetGame}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Reset{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
