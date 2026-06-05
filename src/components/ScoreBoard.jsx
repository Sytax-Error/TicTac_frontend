function ScoreBoard({ score }) {
  return (
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
  );
}

export default ScoreBoard;
