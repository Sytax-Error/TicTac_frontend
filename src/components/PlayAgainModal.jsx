import { motion } from "framer-motion";

function PlayAgainModal({ playAgainRequest, onAccept, onReject }) {
  if (!playAgainRequest) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className="play-again-modal"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <div className="modal-icon">🎮</div>

        <h2>Play Again?</h2>

        <p>
          <strong>{playAgainRequest.username}</strong> wants to start a new
          match.
        </p>

        <div className="modal-actions">
          <button className="reject-btn" onClick={onReject}>
            Reject
          </button>

          <button className="accept-btn" onClick={onAccept}>
            Accept
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PlayAgainModal;
