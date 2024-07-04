import { Note } from "./note";

export class Camera extends Note {
    x: number;
    y: number;
    z: number;
    xoyAngle: number;
    yozAngle: number;
    xozAngle: number;
    easing: EasingType;
    duration: number;

    constructor({
        time = 0,
        x = 0,
        y = 0,
        z = 0,
        xoyAngle = 0,
        yozAngle = 0,
        xozAngle = 0,
        easing = "l" as EasingType,
        duration = 0
    }: CameraOptions = {}) {
        super({ time });
        this.x = x;
        this.y = y;
        this.z = z;
        this.xoyAngle = xoyAngle;
        this.yozAngle = yozAngle;
        this.xozAngle = xozAngle;
        this.easing = easing;
        this.duration = duration;
    }

    get kind() {
        return "camera";
    }

    clone({
        time = this.time,
        x = this.x,
        y = this.y,
        z = this.z,
        xoyAngle = this.xoyAngle,
        yozAngle = this.yozAngle,
        xozAngle = this.xozAngle,
        easing = this.easing,
        duration = this.duration
    }: CameraOptions = {}) {
        return new Camera({
            time,
            x,
            y,
            z,
            xoyAngle,
            yozAngle,
            xozAngle,
            easing,
            duration
        });
    }

    mirror() {
        this.x *= -1;
        this.xoyAngle *= -1;
        this.xozAngle *= -1;
        return this;
    }

    toString() {
        return `camera(${
            Math.floor(this.time)
        },${
            this.x.toFixed(2)
        },${
            this.y.toFixed(2)
        },${
            this.z.toFixed(2)
        },${
            this.xoyAngle.toFixed(2)
        },${
            this.yozAngle.toFixed(2)
        },${
            this.xozAngle.toFixed(2)
        },${
            this.easing
        },${
            Math.floor(this.duration)
        });`;
    }
}