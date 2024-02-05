abstract class Note {
    time: number;

    constructor({
        time = 0
    }: NoteOptions = {}) {
        this.time = time;
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

    get type() {
        return this.constructor.name;
    }

    abstract clone(options?: NoteOptions): Note;
    abstract mirror(): this;
    abstract toString(): string;
}

export default Note;