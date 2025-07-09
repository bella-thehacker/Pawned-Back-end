// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import playRobotRouter from './server'; // Your existing router

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount the PlayRobot router
app.use('/api/play', playRobotRouter);

// Optional test route
app.get('/', (_req, res) => {
  res.send('Chess AI Backend is Running');
});

const PORT = process.env.PORT || 3001;
const server = http.createServer(app); // Wrap Express in HTTP server

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("create-room", (roomCode) => {
    socket.join(roomCode);
    console.log(`Room created: ${roomCode} by ${socket.id}`);
  });

  socket.on("join-room", (roomCode) => {
    const room = io.sockets.adapter.rooms.get(roomCode);

    if (room && room.size === 1) {
      socket.join(roomCode);
      io.to(roomCode).emit("start-game");
      console.log(`Room joined: ${roomCode} by ${socket.id}`);
    } else {
      socket.emit("room-error", "Room full or does not exist");
    }
  });

  socket.on("move", ({ roomCode, move, fen }) => {
  socket.to(roomCode).emit("opponent-move", { move, fen });
});


  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO running at http://localhost:${PORT}`);
});
