const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqttClient = require("./mqtt/mqttClient");
const { connectMQTT } = require('./mqtt/mqttClient');

const mongoClient = require("./db/mongoClient");
const csvLogger = require("./utils/csvLogger");

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // your frontend port
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[INFO] Starting Telemetry Server on port ${PORT}...`);
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`[SOCKET] Frontend connected: ${socket.id}`);
});

// Attach `io` to mqttClient so it can emit messages
connectMQTT(io);
