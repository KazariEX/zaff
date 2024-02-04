import Note from "./note.js";

class SceneControl extends Note
{
    sctype: string;
    param1: number;
    param2: number;

    constructor({
        time = 0,
        sctype = "",
        param1 = 0,
        param2 = 0
    }: ScenecontrolOptions = {}) {
        super({ time });
        this.sctype = sctype;
        this.param1 = param1;
        this.param2 = param2;
    }

    clone({
        time = this.time,
        sctype = this.sctype,
        param1 = this.param1,
        param2 = this.param2
    }: ScenecontrolOptions = {}): SceneControl
    {
        return new SceneControl({
            time, sctype, param1, param2
        });
    }

    mirror(): this
    {
        return this;
    }

    toString(): string
    {
        return `scenecontrol(${
            Math.floor(this.time)
        },${
            this.sctype
        },${
            this.param1.toFixed(2)
        },${
            this.param2.toFixed(0)
        });`;
    }
}

export default SceneControl;