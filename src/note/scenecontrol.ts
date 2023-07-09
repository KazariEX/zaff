import Note from "./note.js";

class SceneControl extends Note
{
    type: string;
    param1: number;
    param2: number;

    constructor({
        time = 0,
        type = "",
        param1 = 0,
        param2 = 0
    } = {}) {
        super();
        this.time = time;
        this.type = type;
        this.param1 = param1;
        this.param2 = param2;
    }

    clone(): SceneControl
    {
        return new SceneControl({
            time: this.time,
            type: this.type,
            param1: this.param1,
            param2: this.param2
        });
    }

    mirror(): this
    {
        return this;
    }

    toString(): string
    {
        return "scenecontrol({1},{2},{3},{4});".arg(
            Math.floor(this.time),
            this.type,
            this.param1.toFixed(2),
            this.param2.toFixed(0)
        );
    }
}

export default SceneControl;