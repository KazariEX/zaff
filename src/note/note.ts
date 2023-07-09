abstract class Note
{
    time: number;

    constructor({
        time = 0
    } = {}) {
        this.time = time;
    }

    moveBy(t: number): this
    {
        this.time += t;
        return this;
    }

    moveTo(t: number): this
    {
        this.time = t;
        return this;
    }

    speedAs(rate: number): this
    {
        this.time = Math.round(this.time / rate);
        return this;
    }

    abstract clone(): Note;
    abstract mirror(): this;
    abstract toString(): string;
}

export default Note;