import Note from "./note.js";

class Tap extends Note
{
    track: number;

    constructor({
        time = 0,
        track = 0
    }: TapOptions = {}) {
        super({ time });
        this.track = track;
    }

    clone({
        time = this.time,
        track = this.track
    }: TapOptions = {}): Tap
    {
        return new Tap({
            time, track
        });
    }

    mirror(): this
    {
        if (this.track % 1 === 0) {
            this.track = 5 - this.track;
        }
        else {
            this.track = 1 - this.track;
        }
        return this;
    }

    toString(): string
    {
        return `(${
            Math.floor(this.time)
        },${
            this.track
        });`;
    }
}

export default Tap;