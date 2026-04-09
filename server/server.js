// server/server.js - Entry point, starts server + socket
const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const setupSocket = require('./socket');
require('dotenv').config();

const PORT = parseInt(process.env.PORT || '5000', 10);
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.io handlers
setupSocket(io);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 RefLink server running on port ${PORT}`);
  console.log(`📡 Socket.io enabled for origins: ${allowedOrigins.join(', ')}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Stop the existing process and restart.`);
    process.exit(1);
    return;
  }
  console.error('❌ Server startup error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
