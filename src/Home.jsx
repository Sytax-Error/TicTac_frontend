import { useEffect, useState } from "react";
import { socket } from "./socket";
import { motion } from "framer-motion";
import "./Home1.css";
import { RotateCcw, Trophy } from "lucide-react";

function Home() {
  const initialBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [winningCells, setWinningCells] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [players, setPlayers] = useState([]);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({
    X: 0,
    O: 0,
  });

  useEffect(() => {
    socket.on("room-update", (data) => {
      setPlayers(data.players);
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setWinner(data.winner);
      setWinningCells(data.winningCells || []);
      setScore(data.score || { X: 0, O: 0 });
      if (data.players.length === 2) {
        setOpponentLeft(false);
      }
    });

    return () => {
      socket.off("room-update");
    };
  }, []);

  useEffect(() => {
    socket.on("player-assigned", (data) => {
      setPlayerInfo(data);
    });

    socket.on("player-left", (data) => {
      setOpponentLeft(true);
      alert(data.message);
    });

    return () => {
      socket.off("player-assigned");
      socket.off("player-left");
    };
  }, []);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRoomId = localStorage.getItem("roomId");

    if (savedUsername && savedRoomId) {
      setUsername(savedUsername);
      setRoomId(savedRoomId);

      socket.emit("join-room", {
        username: savedUsername,
        roomId: savedRoomId,
      });
    }

    socket.on("move-error", (data) => {
      alert(data.message);
    });

    return () => {
      socket.off("move-error");
    };
  }, []);

  const handleJoinRoom = () => {
    setOpponentLeft(false);

    socket.emit("join-room", {
      username,
      roomId,
    });
    localStorage.setItem("username", username);
    localStorage.setItem("roomId", roomId);
  };

  const handleClick = (rowIndex, colIndex) => {
    socket.emit("make-move", {
      roomId: playerInfo?.roomId,
      rowIndex,
      colIndex,
    });
  };

  const resetGame = () => {
    socket.emit("reset-game", {
      roomId: playerInfo?.roomId,
    });
    setOpponentLeft(false);
  };

  const handleLeaveRoom = () => {
    setOpponentLeft(false);

    socket.emit("leave-room", {
      roomId: playerInfo?.roomId,
    });

    localStorage.removeItem("username");
    localStorage.removeItem("roomId");

    setPlayers([]);
    setPlayerInfo(null);
    setBoard(initialBoard);
    setWinner(null);
  };

  const getGameStatus = () => {
    if (opponentLeft) return "Opponent Left";

    if (winner === "Draw") return "Game Draw";

    if (winner === playerInfo?.symbol) return "You Won";

    if (winner) return "You Lost";

    if (currentTurn === playerInfo?.symbol) {
      return "Your Turn";
    }

    return "Opponent Turn";
  };

  const winnerPlayer = players.find((p) => p.symbol === winner);

  const isWinningCell = (rowIndex, colIndex) => {
    return winningCells.some(([r, c]) => r === rowIndex && c === colIndex);
  };

  return (
    <main className="game-page">
      {players.length === 0 && (
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

          <button
            onClick={() => {
              handleJoinRoom();
            }}
          >
            Join Room
          </button>
        </div>
      )}

      {players?.length > 0 && (
        <>
          {playerInfo && (
            <>
              <motion.button
                className="reset-btn"
                onClick={resetGame}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <RotateCcw size={18} />
                Reset
              </motion.button>

              <motion.button
                className="leave-btn"
                onClick={handleLeaveRoom}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <RotateCcw size={18} />
                Leave Room
              </motion.button>
              {opponentLeft && (
                <h2 style={{ color: "#ff9800" }}>Opponent Left The Game</h2>
              )}
            </>
          )}
          {players.length < 2 ? (
            <div>
              <h2>Waiting for opponent...</h2>
              <p>Room Code: {playerInfo?.roomId}</p>
            </div>
          ) : (
            <>
              <div className="game-console">
                <div className="console-header">
                  <div>
                    <span className="status-label">Game Status</span>
                    <h1>{getGameStatus()}</h1>
                  </div>

                  <div className="room-pill">Room #{playerInfo?.roomId}</div>
                </div>

                {winner && (
                  <motion.div
                    className="winner-banner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {winner === "Draw"
                      ? "🤝 Game Draw"
                      : `🏆 ${winnerPlayer?.username} Wins`}
                  </motion.div>
                )}

                <div className="players-strip">
                  <PlayerCard
                    name={players[0]?.username}
                    symbol={players[0]?.symbol}
                    active={currentTurn === players[0]?.symbol && !winner}
                  />

                  <div className="vs-badge">VS</div>

                  <PlayerCard
                    name={players[1]?.username}
                    symbol={players[1]?.symbol}
                    active={currentTurn === players[1]?.symbol && !winner}
                  />
                </div>

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
                            cell !== 0 ||
                            winner ||
                            currentTurn !== playerInfo?.symbol
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

                <div className="score-panel">
                  <div className="score-item x-score">
                    <span>Player X</span>
                    <strong>{score.X}</strong>
                  </div>

                  <div className="score-center">Scoreboard</div>

                  <div className="score-item o-score">
                    <span>Player O</span>
                    <strong>{score.O}</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

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
export default Home;
