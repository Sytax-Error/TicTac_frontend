import { motion } from "framer-motion";

function MessageModal({ messageModal, onClose }) {
  if (!messageModal) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className={`message-modal ${messageModal.type}`}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <div className="message-icon">
          {messageModal.type === "error" ? "❌" : "⚠️"}
        </div>

        <h2>{messageModal.title}</h2>

        <p>{messageModal.message}</p>

        <button className="message-ok-btn" onClick={onClose}>
          OK
        </button>
      </motion.div>
    </div>
  );
}

export default MessageModal;
