# Multiplayer Tic Tac Toe Frontend

This is the frontend application for a real-time multiplayer Tic Tac Toe game.

The frontend is built with **React.js**, **Vite**, **Socket.io Client**, **Framer Motion**, and CSS. It connects to a separate Node.js Socket.io backend.

---

## Features

- Join or create a game room
- Enter username and room code
- Real-time Tic Tac Toe board updates
- Player X and Player O display
- Current turn status
- Winner and draw status
- Winning cell highlight
- Scoreboard
- Reset game
- Leave room
- Opponent left modal
- Play again request modal
- Custom message modal instead of browser alerts
- Modern animated dark UI
- Works on same local network with backend

---

## Tech Stack

- React.js
- Vite
- Socket.io Client
- Framer Motion
- Lucide React
- CSS

---

## Project Structure

```txt
tic-tac-toe-frontend/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx
│   │   ├── GameConsole.jsx
│   │   ├── JoinRoom.jsx
│   │   ├── MessageModal.jsx
│   │   ├── PlayerCard.jsx
│   │   ├── PlayAgainModal.jsx
│   │   └── ScoreBoard.jsx
│   ├── Home.jsx
│   ├── socket.js
│   └── Home1.css
├── package.json
└── vite.config.js

Install Dependencies
npm install
Run Frontend
npm run dev

By default Vite runs on:

http://localhost:5173
Vite Network Setup

To access the frontend from another device on the same network, update vite.config.js:

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});

Then run:

npm run dev

Open on another device:

http://YOUR_IP:5173

Example:

http://192.168.1.10:5173
Socket Connection

The frontend connects to the backend using src/socket.js.

import { io } from "socket.io-client";

export const socket = io("http://YOUR_IP:5000");

For same machine testing:

export const socket = io("http://localhost:5000");

For another device on same network:

export const socket = io("http://192.168.1.10:5000");

Do not use localhost when testing from another device, because localhost means that device itself.

Required Backend

This frontend requires the separate backend project to be running.

Backend should run on:

http://localhost:5000

or for network testing:

http://YOUR_IP:5000
Frontend Responsibilities

The frontend handles:

Join room UI
Game board UI
Player cards
Scoreboard display
Sending socket events
Receiving socket updates
Showing game status
Showing modals
Highlighting winning cells
Responsive UI
Important Socket Events Used
Frontend emits to backend
join-room
make-move
reset-game
leave-room
play-again-request
play-again-accepted
play-again-rejected
Frontend listens from backend
room-update
player-assigned
player-left
move-error
play-again-requested
play-again-started
play-again-rejected
Game Flow
User enters username and room code
        ↓
Frontend emits join-room
        ↓
Backend assigns X or O
        ↓
Frontend receives player-assigned
        ↓
Both players receive room-update
        ↓
Players make moves
        ↓
Frontend emits make-move
        ↓
Backend validates move
        ↓
Frontend receives updated board
Components
JoinRoom.jsx

Handles username and room code form.

GameConsole.jsx

Main game UI wrapper.

GameBoard.jsx

Displays the 3x3 Tic Tac Toe board.

PlayerCard.jsx

Displays player name and symbol.

ScoreBoard.jsx

Displays score for X and O.

PlayAgainModal.jsx

Shows play again request modal.

MessageModal.jsx

Shows custom message modal for errors, warnings, and opponent-left messages.

Game Rules Displayed in Frontend
First player is X
Second player is O
X starts first
Only current player can click
Filled cell cannot be clicked
Winner cells are highlighted
Score updates after win
Play Again keeps score but resets board
Troubleshooting
Board move not showing on another device

Make sure backend is running and socket.js points to the backend IP.

export const socket = io("http://YOUR_IP:5000");
Another device cannot open frontend

Check Vite config:

server: {
  host: "0.0.0.0",
  port: 5173,
}

Also allow firewall port:

sudo ufw allow 5173
Socket not connecting

Check:

Backend is running
Backend port is 5000
Frontend socket.js URL is correct
Both devices are on same network
Firewall allows port 5000
Future Improvements
Add sound effects
Add player avatars
Add timer per move
Add better mobile UI
Add authentication
Add match history
Add spectator mode
Add room password