import Note from "./note.js";

class Timing extends Note
{
    bpm: number;
    beats: number;

    constructor({
        time = 0,
        bpm = 0,
        beats = 0
    }: TimingOptions = {}) {
        super({ time });
        this.bpm = bpm;
        this.beats = beats;
    }

    clone({
        time = this.time,
        bpm = this.bpm,
        beats = this.beats
    }: TimingOptions = {}): Timing
    {
        return new Timing({
            time, bpm, beats
        });
    }

    mirror(): this
    {
        return this;
    }

    speedAs(rate: number): this
    {
        super.speedAs(rate);
        this.bpm *= rate;
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