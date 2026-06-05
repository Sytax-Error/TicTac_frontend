function JoinRoom({
  username,
  roomId,
  setUsername,
  setRoomId,
  handleJoinRoom,
}) {
  return (
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
  );
}

export default JoinRoom;
