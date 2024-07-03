import Note from "./note";

class Flick extends Note {
    x: number;
    y: number;
    vx: number;
    vy: number;

    constructor({
        time = 0,
        x = 0,
        y = 0,
        vx = 0,
        vy = 0
    }: FlickOptions = {}) {
        super({ time });
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    clone({
        time = this.time,
        x = this.x,
        y = this.y,
        vx = this.vx,
        vy = this.vy
    }: FlickOptions = {}) {
        return new Flick({
            time,
            x,
            y,
            vx,
            vy
        });
    }

    mirror() {
        this.x = 1 - this.x;
        this.vx = -this.vx;
        return this;
    }

    toString() {
        return `flick(${
            Math.floor(this.time)
        },${
            this.x.toFixed(2)
        },${
            this.y.toFixed(2)
        },${
            this.vx.toFixed(2)
        },${
            this.vy.toFixed(2)
        });`;
    }
}

export default Flick;