import Note from "./note.js";

class Tap extends Note
{
    track: number;

    constructor({
        time = 0,
        track = 0
    } = {}) {
        super();
        this.time = time;
        this.track = track;
    }

    clone(): Tap
    {
        return new Tap({
            time: this.time,
            track: this.track
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
        return "({1},{2});".arg(
            Math.floor(this.time),
            Number(this.track)
        );
    }
}

export default Tap;