import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const PORT = 3000;

// Game State
const players: Record<string, any> = {};
const rooms: Record<string, any> = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (data) => {
    const { roomId, playerName } = data;
    socket.join(roomId);
    
    players[socket.id] = {
      id: socket.id,
      name: playerName,
      roomId,
      x: 100,
      y: 100,
      angle: 0,
      speed: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      isFinished: false
    };

    io.to(roomId).emit('player-joined', players[socket.id]);
    socket.emit('init-players', Object.values(players).filter(p => p.roomId === roomId));
  });

  socket.on('move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].angle = data.angle;
      players[socket.id].speed = data.speed;
      
      socket.to(players[socket.id].roomId).emit('player-moved', players[socket.id]);
    }
  });

  socket.on('finish-race', () => {
    const player = players[socket.id];
    if (player && !player.isFinished) {
      player.isFinished = true;
      io.to(player.roomId).emit('race-winner', player.name);
    }
  });

  socket.on('disconnect', () => {
    if (players[socket.id]) {
      const { roomId } = players[socket.id];
      socket.to(roomId).emit('player-left', socket.id);
      delete players[socket.id];
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
