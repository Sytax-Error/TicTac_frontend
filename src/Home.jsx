import { useEffect, useState } from "react";
import { socket } from "./socket";
import { motion } from "framer-motion";
import "./Home1.css";
import { RotateCcw } from "lucide-react";
import PlayerCard from "./components/PlayerCard";
import JoinRoom from "./components/JoinRoom";
import GameBoard from "./components/GameBoard";
import MessageModal from "./components/MessageModal";
import PlayAgainModal from "./components/PlayAgainModal";
import ScoreBoard from "./components/ScoreBoard";
import GameConsole from "./components/GameConsole";

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
  const [playAgainRequest, setPlayAgainRequest] = useState(null);
  const [messageModal, setMessageModal] = useState(null);
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
    socket.on("play-again-requested", (data) => {
      setPlayAgainRequest(data);
    });

    return () => {
      socket.off("room-update");
      socket.off("play-again-requested");
    };
  }, []);

  useEffect(() => {
    socket.on("player-assigned", (data) => {
      setPlayerInfo(data);
    });

    socket.on("player-left", (data) => {
      setOpponentLeft(true);

      setMessageModal({
        title: "Opponent Left",
        message: data.message,
        type: "warning",
      });
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
      setMessageModal({
        title: "Invalid Move",
        message: data.message,
        type: "warning",
      });
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

  const handlePlayAgainRequest = () => {
    socket.emit("play-again-requested", {
      roomId: playerInfo.roomId,
    });
  };

  const handleAcceptPlayAgain = () => {
    socket.emit("play-again-accepted", {
      roomId: playerInfo?.roomId,
    });

    setPlayAgainRequest(null);
  };

  useEffect(() => {
    socket.on("play-again-started", () => {
      setPlayAgainRequest(null);
    });

    return () => {
      socket.off("play-again-started");
    };
  }, []);

  useEffect(() => {
    socket.on("play-again-rejected", (data) => {
      setMessageModal({
        title: "Request Rejected",
        message: data.message,
        type: "error",
      });
    });
    return () => {
      socket.off("play-again-rejected");
    };
  }, []);

  const handleRejectPlayAgain = () => {
    socket.emit("play-again-rejected", {
      roomId: playerInfo?.roomId,
    });

    setPlayAgainRequest(null);
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
  console.log("pla", playAgainRequest);
  return (
    <main className="game-page">
      {players.length === 0 && (
        <JoinRoom
          username={username}
          roomId={roomId}
          setUsername={setUsername}
          setRoomId={setRoomId}
          handleJoinRoom={handleJoinRoom}
        />
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
              {winner && (
                <button
                  className="play-again-btn"
                  onClick={handlePlayAgainRequest}
                >
                  Play Again
                </button>
              )}

              <motion.button
                className="leave-btn"
                onClick={handleLeaveRoom}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <RotateCcw size={18} />
                Leave Room
              </motion.button>
            </>
          )}
          {players.length < 2 ? (
            <div>
              <h2>Waiting for opponent...</h2>
              <p>Room Code: {playerInfo?.roomId}</p>
            </div>
          ) : (
            <GameConsole
              players={players}
              playerInfo={playerInfo}
              currentTurn={currentTurn}
              winner={winner}
              winnerPlayer={winnerPlayer}
              score={score}
              board={board}
              getGameStatus={getGameStatus}
              handleClick={handleClick}
              isWinningCell={isWinningCell}
              handlePlayAgainRequest={handlePlayAgainRequest}
            />
          )}
        </>
      )}
      {playAgainRequest && (
        <PlayAgainModal
          playAgainRequest={playAgainRequest}
          onAccept={handleAcceptPlayAgain}
          onReject={handleRejectPlayAgain}
        />
      )}
      {messageModal && (
        <MessageModal
          messageModal={messageModal}
          onClose={() => setMessageModal(null)}
        />
      )}
    </main>
  );
}

export default Home;
