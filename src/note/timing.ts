import Note from "./note.js";

class Timing extends Note
{
    bpm: number;
    beats: number;

    constructor({
        time = 0,
        bpm = 0,
        beats = 0
    } = {}) {
        super();
        this.time = time;
        this.bpm = bpm;
        this.beats = beats;
    }

    clone(): Timing
    {
        return new Timing({
            time: this.time,
            bpm: this.bpm,
            beats: this.beats
        });
    }

    mirror(): this
    {
        return this;
    }

    toString(): string
    {
        return "timing({1},{2},{3});".arg(
            Math.floor(this.time),
            this.bpm.toFixed(2),
            this.beats.toFixed(2)
        );
    }
}

export default Timing;