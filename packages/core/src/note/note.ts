import type { NoteOptions } from "../types";

export abstract class Note {
    time: number;

    constructor({
        time = 0
    }: NoteOptions = {}) {
        this.time = time;
    }

    mirror() {
        return this;
    }

    moveBy(t: number) {
        this.time += t;
        return this;
    }

    moveTo(t: number) {
        this.time = t;
        return this;
    }

    speedAs(rate: number) {
        this.time = Math.round(this.time / rate);
        return this;
    }

    abstract get kind(): string;
    abstract clone(options?: NoteOptions): Note;
    abstract toString(): string;
}