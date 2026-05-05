import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { Physics } from './game/Physics.js';
import { Player } from './models/Player.js';
import { RaceManager } from './game/RaceManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;
const players = {};
const raceManager = new RaceManager();

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    players[socket.id] = new Player(socket.id, data.name, color);
    io.emit('player-update', Object.values(players));
    socket.emit('init-game', { id: socket.id, status: raceManager.getStatus() });
  });

  socket.on('move', (inputs) => {
    if (players[socket.id] && !players[socket.id].isFinished) {
      const result = Physics.update(players[socket.id], inputs);
      if (result.crossedFinish && raceManager.getStatus() === 'RACING') {
        const player = players[socket.id];
        player.isFinished = true;
        player.wins += 1; // Ball qo'shish
        
        const emojis = ['🏆', '🏎️', '🔥', '😎', '👑', '🥇', '⚡', '✨'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        raceManager.setWinner(player.name);
        io.emit('race-winner', { name: player.name, emoji: randomEmoji });
        io.emit('player-update', Object.values(players)); // Reytingni yangilash
      }
      socket.broadcast.emit('player-update', Object.values(players));
    }
  });

  socket.on('start-race', () => {
    raceManager.startRace(players);
    io.emit('race-start');
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('player-update', Object.values(players));
  });
});

// Productionda client fayllarini ulash
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
