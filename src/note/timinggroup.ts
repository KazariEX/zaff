import Note from "./note.js";

class TimingGroup extends Array<Note> {
    attributes: Array<string>;

    constructor(noteList: Array<Note> = [], attr: Array<string> = []) {
        super();
        noteList.forEach((note, index) => {
            this[index] = note;
        });
        this.attributes = attr;
    }

    mirror() {
        this.forEach((note: Note) => note.mirror());
        return this;
    }

    moveBy(t: number) {
        this.forEach((note: Note) => note.moveBy(t));
        return this;
    }

    speedAs(rate: number) {
        this.forEach((note) => note.speedAs(rate));
        return this;
    }

    toString(outer: boolean = false) {
        const inner = this.map((note: Note) => {
            return note.toString();
        });

        if (outer) {
            return `timinggroup(${
                this.attributes.join("_")
            }){\n  ${
                inner.join("\n  ")
            }\n};`;
        }
        else {
            return inner.join("\n");
        }
    }
}

export default TimingGroup;