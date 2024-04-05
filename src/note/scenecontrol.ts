import Note from "./note";

class SceneControl extends Note {
    type: string;
    param1: number;
    param2: number;

    constructor({
        time = 0,
        type = "",
        param1 = 0,
        param2 = 0
    }: ScenecontrolOptions = {}) {
        super({ time });
        this.type = type;
        this.param1 = param1;
        this.param2 = param2;
    }

    clone({
        time = this.time,
        type = this.type,
        param1 = this.param1,
        param2 = this.param2
    }: ScenecontrolOptions = {}) {
        return new SceneControl({
            time, type, param1, param2
        });
    }

    mirror() {
        return this;
    }

    toString() {
        return `scenecontrol(${
            Math.floor(this.time)
        },${
            this.type
        },${
            this.param1.toFixed(2)
        },${
            this.param2.toFixed(0)
        });`;
    }
}

export default SceneControl;