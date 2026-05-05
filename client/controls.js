export class Controls {
    constructor() {
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(e, isDown) {
        switch(e.key) {
            case 'w': case 'ArrowUp': this.keys.up = isDown; break;
            case 's': case 'ArrowDown': this.keys.down = isDown; break;
            case 'a': case 'ArrowLeft': this.keys.left = isDown; break;
            case 'd': case 'ArrowRight': this.keys.right = isDown; break;
        }
    }
}
