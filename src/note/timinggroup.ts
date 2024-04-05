import Note from "./note.js";

class TimingGroup extends Array<Note> {
    attributes: string[];

    constructor(noteList: Note[] = [], attrs: string[] = []) {
        if (typeof arguments[0] === "number") {
            super(...arguments);
        }
        else {
        super();
            this.push(...noteList);
            this.attributes = attrs;
        }
    }
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