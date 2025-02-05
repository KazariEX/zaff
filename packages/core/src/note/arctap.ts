import { Note } from "./note";
import type { ArctapOptions, NoteKind } from "../types";

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

    get kind(): NoteKind {
        return "arctap";
    }

    static is(note: Note): note is Arctap {
        return note.kind === "arctap";
    }
}