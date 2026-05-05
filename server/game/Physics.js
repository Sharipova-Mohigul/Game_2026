export const Physics = {
  ACCELERATION: 0.2,
  BRAKE: 0.3,
  FRICTION: 0.98,
  MAX_SPEED: 8,
  TURN_SPEED: 0.05,
  
  TRACK_CENTER_X: 600,
  TRACK_CENTER_Y: 400,
  TRACK_INNER_RADIUS: 250,
  TRACK_OUTER_RADIUS: 500,

  update(player, inputs) {
    // Aylanis (Faqat harakatda bo'lganda)
    if (Math.abs(player.speed) > 0.5) {
      const direction = player.speed > 0 ? 1 : -1;
      if (inputs.left) player.angle -= this.TURN_SPEED * direction;
      if (inputs.right) player.angle += this.TURN_SPEED * direction;
    }

    // Tezlanish
    if (inputs.up) {
      player.speed += this.ACCELERATION;
    } else if (inputs.down) {
      player.speed -= this.BRAKE;
    } else {
      player.speed *= this.FRICTION;
    }

    // Tezlik chegarasi
    if (player.speed > this.MAX_SPEED) player.speed = this.MAX_SPEED;
    if (player.speed < -this.MAX_SPEED / 2) player.speed = -this.MAX_SPEED / 2;
    if (Math.abs(player.speed) < 0.05) player.speed = 0;

    // Yangi pozitsiya
    const nextX = player.x + Math.cos(player.angle) * player.speed;
    const nextY = player.y + Math.sin(player.angle) * player.speed;

    // Kolliziya (Track boundaries)
    const dist = Math.sqrt(Math.pow(nextX - this.TRACK_CENTER_X, 2) + Math.pow(nextY - this.TRACK_CENTER_Y, 2));
    if (dist > this.TRACK_INNER_RADIUS && dist < this.TRACK_OUTER_RADIUS) {
      player.x = nextX;
      player.y = nextY;
    } else {
      player.speed *= -0.5; // Devorga urilganda orqaga qaytish
    }

    // Finish line (Y o'qi bo'ylab pastga tushish)
    const crossedFinish = player.y < this.TRACK_CENTER_Y && nextY >= this.TRACK_CENTER_Y && 
                          player.x > this.TRACK_CENTER_X + this.TRACK_INNER_RADIUS;

    return { crossedFinish };
  }
};
