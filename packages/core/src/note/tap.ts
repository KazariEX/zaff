import { Note } from "./note";
import type { NoteKind, TapOptions } from "../types";

export class Tap extends Note {
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
    }: TapOptions = {}) {
        return new Tap({
            time,
            track
        });
    }

    override mirror() {
        if (this.track % 1 === 0) {
            this.track = 5 - this.track;
        }
        else {
            this.track = 1 - this.track;
        }
        return this;
    }

    toString() {
        return `(${
            Math.floor(this.time)
        },${
            this.track
        });`;
    }

    get kind(): NoteKind {
        return "tap";
    }

    static is(note: Note): note is Tap {
        return note.kind === "tap";
    }
}