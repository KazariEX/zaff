import { Note } from "./note";
import type { NoteKind, TimingOptions } from "../types";

export class Timing extends Note {
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
    }: TimingOptions = {}) {
        return new Timing({
            time,
            bpm,
            beats
        });
    }

    override speedAs(rate: number) {
        super.speedAs(rate);
        this.bpm *= rate;
        return this;
    }

    toString() {
        return `timing(${
            Math.floor(this.time)
        },${
            this.bpm.toFixed(2)
        },${
            this.beats.toFixed(2)
        });`;
    }

    get kind(): NoteKind {
        return "timing";
    }

    static is(note: Note): note is Timing {
        return note.kind === "timing";
    }
}