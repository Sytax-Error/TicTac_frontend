import { motion } from "framer-motion";

function GameBoard({
  board,
  winner,
  currentTurn,
  playerInfo,
  handleClick,
  isWinningCell,
}) {
  return (
    <div className="board-zone">
      <motion.div
        className="board"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {board?.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell === "X" ? "x-cell" : ""} ${
                cell === "O" ? "o-cell" : ""
              } ${isWinningCell(rowIndex, colIndex) ? "winning-cell" : ""}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              disabled={
                cell !== 0 || winner || currentTurn !== playerInfo?.symbol
              }
            >
              {cell !== 0 && (
                <motion.span
                  key={`${rowIndex}-${colIndex}-${cell}`}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          )),
        )}
      </motion.div>
    </div>
  );
}

export default GameBoard;
