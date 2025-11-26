// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

const users = {};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(`👤 ${username} joined`);
    io.emit("userJoined", username);
  });

  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data);
    console.log(`💬 Message from ${data.username}: ${data.text}`);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    console.log(`🔴 ${username || "Unknown"} disconnected`);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

