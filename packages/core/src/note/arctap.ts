import type { ArctapOptions } from "../types";
import { Note } from "./note";

export class Arctap extends Note {
    clone({
        time = this.time
    }: ArctapOptions = {}) {
        return new Arctap({
            time
        });
    }

    toString() {
        return `arctap(${
            Math.floor(this.time)
        });`;
    }

    get kind() {
        return "arctap";
    }

    static is(note: Note): note is Arctap {
        return note.kind === "arctap";
    }
}