import { motion } from "framer-motion";

function PlayerCard({ active, name, symbol }) {
  return (
    <motion.div
      className={`player-card ${active ? "active" : ""}`}
      animate={{
        scale: active ? 1.03 : 1,
      }}
    >
      <div
        className={`player-symbol ${symbol === "X" ? "x-symbol" : "o-symbol"}`}
      >
        {symbol}
      </div>

      <div>
        <p>{active ? "Current Turn" : "Player"}</p>
        <h2>{name}</h2>
      </div>
    </motion.div>
  );
}

export default PlayerCard;
