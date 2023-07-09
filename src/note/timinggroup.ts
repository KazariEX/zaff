import Note from "./note.js";

class TimingGroup extends Array<Note>
{
    attributes: Array<string>;

    constructor(noteList: Array<Note> = [], attr: Array<string> = [])
    {
        super();
        noteList.forEach((note, index) => {
            this[index] = note;
        });
        this.attributes = attr;
    }

    moveBy(t: number): this
    {
        this.forEach((note: Note) => note.moveBy(t));
        return this;
    }

    mirror(): this
    {
        this.forEach((note: Note) => note.mirror());
        return this;
    }

    toString(outer: boolean = false): string
    {
        const inner = [...this].map((note: Note) => {
            return note.toString();
        });

        if (outer) {
            return "timinggroup({1}){\n  {2}\n};".arg(
                this.attributes.join("_"),
                inner.join("\n  ")
            );
        }
        else {
            return inner.join("\n");
        }
    }
}

export default TimingGroup;