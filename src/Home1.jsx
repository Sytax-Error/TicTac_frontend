import { useEffect, useState } from "react";
import { socket } from "./socket";
import { motion } from "framer-motion";
import { RotateCcw, Trophy, Wifi, WifiOff } from "lucide-react";
import "./Home.css";

const initialBoard = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    function handleConnect() {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    }

    function handleDisconnect(reason) {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    }

    function handleGameState(data) {
      console.log("Game state received:", data);

      setBoard(data.board || initialBoard);
      setIsXTurn(data.isXTurn);
      setWinner(data.winner || "");
    }
    socket.on("room-created", (data) => {
      console.log("Room data:", data);
    });

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("game-state", handleGameState);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("game-state", handleGameState);
    };
  }, []);

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter name and room code");
      return;
    }

    socket.emit("join-room", {
      username,
      roomId,
    });

    setJoined(true);
  };

  const handleClick = (rowIndex, colIndex) => {
    if (!socket.connected) {
      console.log("Socket not connected");
      socket.connect();
      return;
    }

    if (board[rowIndex][colIndex] !== 0 || winner) return;

    socket.emit("player-move", {
      rowIndex,
      colIndex,
    });
  };

  const resetGame = () => {
    if (!socket.connected) {
      socket.connect();
      return;
    }

    socket.emit("reset-game");
  };

  if (!joined) {
    return (
      <main className="game-page">
        <div className="join-card">
          <h1>Tic Tac Toe</h1>
          <p>Create or join a room</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter room code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page">
      <div className={isConnected ? "connection online" : "connection offline"}>
        {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        {isConnected ? "Online" : "Offline"}
      </div>

      <motion.button
        className="reset-btn"
        onClick={resetGame}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <RotateCcw size={18} />
        Reset
      </motion.button>

      <motion.h1
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Tic Tac Toe
      </motion.h1>

      <motion.div
        className="status-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {winner ? (
          <h2>
            <Trophy size={22} />
            {winner === "Draw" ? "Game Draw!" : `${winner} Wins`}
          </h2>
        ) : (
          <h2>Turn: {isXTurn ? "Player 1 - X" : "Player 2 - O"}</h2>
        )}
      </motion.div>

      <section className="game-shell">
        <PlayerCard active={isXTurn && !winner} name={username} symbol="X" />

        <motion.div
          className="board"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell === "X" ? "x-cell" : ""} ${
                  cell === "O" ? "o-cell" : ""
                }`}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={cell !== 0 || !!winner}
                whileHover={{ scale: cell === 0 && !winner ? 1.05 : 1 }}
                whileTap={{ scale: cell === 0 && !winner ? 0.92 : 1 }}
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

        <PlayerCard active={!isXTurn && !winner} name="Player 2" symbol="O" />
      </section>

      {winner && (
        <motion.div
          className="winner-popup"
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
        >
          <Trophy size={26} />
          <p>{winner === "Draw" ? "Match Draw!" : `${winner} is Winner!`}</p>
        </motion.div>
      )}
    </main>
  );
}

function PlayerCard({ active, name, symbol }) {
  return (
    <motion.div
      className={`player-card ${active ? "active" : ""}`}
      animate={{
        scale: active ? 1.04 : 1,
        opacity: active ? 1 : 0.75,
      }}
    >
      <h2>{name}</h2>
      <p>{symbol}</p>
    </motion.div>
  );
}

export default Home;
