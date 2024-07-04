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
}