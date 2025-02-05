import { Tap } from "./tap";
import type { HoldOptions, NoteKind } from "../types";
import type { Note } from "./note";

export class Hold extends Tap {
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

    override clone({
        time = this.time,
        timeEnd = this.timeEnd,
        track = this.track
    }: HoldOptions = {}) {
        return new Hold({
            time,
            timeEnd,
            track
        });
    }

    get duration() {
        return this.timeEnd - this.time;
    }

    override moveBy(t: number) {
        super.moveBy(t);
        this.timeEnd += t;
        return this;
    }

    override moveTo(t: number) {
        this.timeEnd = t + this.timeEnd - this.time;
        super.moveTo(t);
        return this;
    }

    override speedAs(rate: number) {
        super.speedAs(rate);
        this.timeEnd = Math.round(this.timeEnd / rate);
        return this;
    }

    override toString() {
        return `hold(${
            Math.floor(this.time)
        },${
            Math.floor(this.timeEnd)
        },${
            this.track
        });`;
    }

    override get kind(): NoteKind {
        return "hold";
    }

    static override is(note: Note): note is Hold {
        return note.kind === "hold";
    }
}