import Aff from "./aff.js";
import * as Easing from "./utils/easing.js";

declare global
{
    type EasingType = "b" | "l" | "qi" | "qo" | "reset" | "s" | "si" | "so" | "sisi" | "siso" | "sosi" | "soso";

    interface Point {
        x: number,
        y: number
    }

    interface NoteOptions {
        time?: number
    }

    interface ArcOptions {
        time?: number,
        timeEnd?: number,
        x1?: number,
        x2?: number,
        easing?: EasingType,
        y1?: number,
        y2?: number,
        color?: number,
        hitsound?: string,
        skyline?: boolean,
        arctap?: Array<number>
    }

    interface CameraOptions {
        time?: number,
        x?: number,
        y?: number,
        z?: number,
        xoyAngle?: number,
        yozAngle?: number,
        xozAngle?: number,
        easing?: EasingType,
        duration?: number
    }

    interface HoldOptions {
        time?: number,
        timeEnd?: number,
        track?: number
    }

    interface ScenecontrolOptions {
        time?: number,
        sctype?: string,
        param1?: number,
        param2?: number
    }

    interface TapOptions {
        time?: number,
        track?: number
    }

    interface TimingOptions {
        time?: number,
        bpm?: number,
        beats?: number
    }

    interface EasingFunction {
        (percent: number): number
    }

    interface String {
        arg(...list: Array<any>): string;
    }
}

String.prototype.arg = function(...list: Array<string>)
{
    let str = this.valueOf();
    list.forEach((item, index) => {
        str = str.replaceAll(new RegExp(`\\{${index + 1}\\}`, "g"), item);
    });
    return str;
}

export default Aff;
export {
    Aff,
    Easing
};