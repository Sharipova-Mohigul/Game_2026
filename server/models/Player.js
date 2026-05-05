export class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.x = 600 + 350; // Boshlang'ich nuqta
    this.y = 400 - 50;
    this.angle = 0;
    this.speed = 0;
    this.isFinished = false;
    this.wins = 0;
    this.ready = false;
  }
}
