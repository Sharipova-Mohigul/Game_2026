export class Renderer {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = 1200;
        this.height = canvas.height = 800;
        
        this.track = {
            centerX: 600,
            centerY: 400,
            inner: 250,
            outer: 500
        };
    }

    render(players, localPlayerId) {
        this.clear();
        this.drawTrack();
        
        players.forEach(p => {
            this.drawKart(p, p.id === localPlayerId);
        });
    }

    clear() {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawTrack() {
        // Outer boundary
        this.ctx.beginPath();
        this.ctx.arc(this.track.centerX, this.track.centerY, this.track.outer, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.stroke();

        // Inner boundary
        this.ctx.beginPath();
        this.ctx.arc(this.track.centerX, this.track.centerY, this.track.inner, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.stroke();

        // Finish line
        this.ctx.beginPath();
        this.ctx.moveTo(this.track.centerX + this.track.inner, this.track.centerY);
        this.ctx.lineTo(this.track.centerX + this.track.outer, this.track.centerY);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 10;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }

    drawKart(player, isLocal) {
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);

        if (isLocal) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = player.color;
        }

        // Body
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(-20, -10, 40, 20);

        // Indicator (Front)
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(15, -10, 5, 20);

        this.ctx.restore();

        // Label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, player.x, player.y - 25);
    }
}
