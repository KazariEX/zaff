import Tap from "./tap.js";

class Hold extends Tap
{
    timeEnd: number;

    constructor({
        time = 0,
        timeEnd = 0,
        track = 0
    }: HoldOptions = {}) {
        super({ time });
        this.timeEnd = timeEnd;
        this.track = track;
    }

    clone({
        time = this.time,
        timeEnd = this.timeEnd,
        track = this.track
    }: HoldOptions): Hold
    {
        return new Hold({
            time, timeEnd, track
        });
    }

    get duration(): number
    {
        return this.timeEnd - this.time;
    }

    moveBy(t: number): this
    {
        super.moveBy(t);
        this.timeEnd += t;
        return this;
    }

    moveTo(t: number): this
    {
        this.timeEnd = t + this.timeEnd - this.time;
        super.moveTo(t);
        return this;
    }

    speedAs(rate: number): this
    {
        super.speedAs(rate);
        this.timeEnd = Math.round(this.timeEnd / rate);
        return this;
    }

    toString(): string
    {
        return "hold({1},{2},{3});".arg(
            Math.floor(this.time),
            Math.floor(this.timeEnd),
            this.track
        );
    }
}

export default Hold;