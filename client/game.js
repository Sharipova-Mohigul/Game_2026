import { Renderer } from './renderer.js';
import { Controls } from './controls.js';
import { SocketHandler } from './socketHandler.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.controls = new Controls();
        this.socket = new SocketHandler(this);
        
        this.myId = null;
        this.players = [];
        this.gameStarted = false;

        this.initUI();
    }

    initUI() {
        this.lobby = document.getElementById('lobby');
        this.gameUi = document.getElementById('game-ui');
        this.nameInput = document.getElementById('nameInput');
        this.joinBtn = document.getElementById('joinBtn');
        this.playerList = document.getElementById('playerList');
        this.speedValue = document.getElementById('speedValue');
        this.startBtn = document.getElementById('startBtn');
        this.winnerScreen = document.getElementById('winner-screen');
        this.winnerName = document.getElementById('winner-name');

        this.joinBtn.onclick = () => {
            const name = this.nameInput.value.trim() || 'Racer';
            this.socket.join(name);
            this.lobby.classList.add('hidden');
            this.gameUi.classList.remove('hidden');
        };

        this.startBtn.onclick = () => {
            this.socket.startRace();
        };
    }

    onInit(data) {
        this.myId = data.id;
        if (this.myId) this.startBtn.classList.remove('hidden');
    }

    onRaceStart() {
        this.gameStarted = true;
        this.winnerScreen.classList.add('hidden');
        this.startBtn.classList.add('hidden');
    }

    onRaceWinner(data) {
        this.winnerName.innerText = `${data.emoji} ${data.name} ${data.emoji}`;
        this.winnerScreen.classList.remove('hidden');
        this.gameStarted = false;
    }

    updateLeaderboard() {
        this.playerList.innerHTML = this.players
            .sort((a, b) => b.wins - a.wins) // Reyting bo'yicha saralash
            .map(p => `
            <div style="color: ${p.color}; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem;">
                ${p.name}: ${p.wins} Wins ${p.id === this.myId ? '⭐' : ''}
            </div>
        `).join('');
    }

    loop() {
        if (this.myId) {
            this.socket.sendMove(this.controls.keys);
            
            const me = this.players.find(p => p.id === this.myId);
            if (me) {
                this.speedValue.innerText = Math.round(Math.abs(me.speed * 20));
            }
        }

        this.updateLeaderboard();
        this.renderer.render(this.players, this.myId);
        requestAnimationFrame(() => this.loop());
    }
}

const game = new Game();
game.loop();
