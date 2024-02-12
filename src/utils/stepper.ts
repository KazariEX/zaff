import Timing from "../note/timing.js";

class Stepper {
    time: number;
    bpm: number;
    beats: number;

    constructor(timing: Timing);
    constructor(options: TimingOptions);
    constructor({
        time = 0,
        bpm = 0,
        beats = 0
    }: Timing | TimingOptions = {}) {
        this.time = time;
        this.bpm = bpm;
        this.beats = beats;
    }

    * generate(pattern: number[], {
        noteValue = this.beats,
        timeEnd = Infinity
    } = {}) {
        const duration = 240000 / this.bpm / noteValue;

        if (!pattern || pattern.length === 0) {
            pattern = [1];
        }

        let time = this.time;
        for (let i = 0; time < timeEnd; i++, i %= pattern.length) {
            yield time;
            time += duration * pattern[i];
        }
        return time;
    }
}

export default Stepper;