// server/server.js - Entry point, starts server + socket
const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const setupSocket = require('./socket');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.io handlers
setupSocket(io);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 RefLink server running on port ${PORT}`);
  console.log(`📡 Socket.io enabled on ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
