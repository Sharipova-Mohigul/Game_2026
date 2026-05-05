export class RaceManager {
  constructor() {
    this.gameStatus = 'LOBBY'; // LOBBY, RACING
    this.winner = null;
  }

  startRace(players) {
    this.gameStatus = 'RACING';
    this.winner = null;
    
    Object.values(players).forEach(p => {
      p.isFinished = false;
      p.x = 600 + 350;
      p.y = 400 - 50;
      p.angle = 0;
      p.speed = 0;
    });
  }

  setWinner(name) {
    this.winner = name;
    this.gameStatus = 'LOBBY';
  }

  getStatus() {
    return this.gameStatus;
  }
}
