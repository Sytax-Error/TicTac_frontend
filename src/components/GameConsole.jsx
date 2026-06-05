import PlayerCard from "./PlayerCard";
import GameBoard from "./GameBoard";
import ScoreBoard from "./ScoreBoard";

function GameConsole({
  players,
  playerInfo,
  currentTurn,
  winner,
  winnerPlayer,
  score,
  board,
  getGameStatus,
  handleClick,
  isWinningCell,
}) {
  return (
    <div className="game-console">
      <div className="console-header">
        <div>
          <span className="status-label">Game Status</span>
          <h1>{getGameStatus()}</h1>
        </div>

        <div className="room-pill">Room #{playerInfo?.roomId}</div>
      </div>

      {winner && (
        <div className="winner-banner">
          {winner === "Draw"
            ? "🤝 Game Draw"
            : `🏆 ${winnerPlayer?.username} Wins`}
        </div>
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

      <GameBoard
        board={board}
        winner={winner}
        currentTurn={currentTurn}
        playerInfo={playerInfo}
        handleClick={handleClick}
        isWinningCell={isWinningCell}
      />

      <ScoreBoard score={score} />
    </div>
  );
}

export default GameConsole;
