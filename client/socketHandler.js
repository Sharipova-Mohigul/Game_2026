export class SocketHandler {
    constructor(game) {
        this.socket = io();
        this.game = game;
        this.setupListeners();
    }

    setupListeners() {
        this.socket.on('init-game', (data) => {
            this.game.onInit(data);
        });

        this.socket.on('player-update', (players) => {
            this.game.players = players;
        });

        this.socket.on('race-start', () => {
            this.game.onRaceStart();
        });

        this.socket.on('race-winner', (name) => {
            this.game.onRaceWinner(name);
        });
    }

    join(name) {
        this.socket.emit('join', { name });
    }

    sendMove(keys) {
        this.socket.emit('move', keys);
    }

    startRace() {
        this.socket.emit('start-race');
    }
}
