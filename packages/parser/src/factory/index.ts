import { Arc, Arctap, Camera, Flick, Hold, SceneControl, Tap, Timing, TimingGroup } from "@zaff/core";
import { createFactory } from "./create";

// 处理与生成物件
export const factory = createFactory({
    arc: {
        paramsCount: 10,
        connectKinds: ["arctap"],
        fieldTypes: {
            time: ["int"],
            timeEnd: ["int"],
            x1: ["float"],
            x2: ["float"],
            easing: ["word"],
            y1: ["float"],
            y2: ["float"],
            color: ["int"],
            hitsound: ["word"],
            skyline: ["word"]
        },
        return: (options, connects = []) => {
            options.arctap = connects.map((note) => note.time);
            return new Arc(options);
        }
    },
    arctap: {
        paramsCount: 1,
        fieldTypes: {
            time: ["int"]
        },
        return: (options) => new Arctap(options)
    },
    camera: {
        paramsCount: 9,
        fieldTypes: {
            time: ["int"],
            x: ["float"],
            y: ["float"],
            z: ["float"],
            xoyAngle: ["float"],
            yozAngle: ["float"],
            xozAngle: ["float"],
            easing: ["word"],
            duration: ["int"]
        },
        return: (options) => new Camera(options)
    },
    flick: {
        paramsCount: 5,
        fieldTypes: {
            time: ["int"],
            x: ["float"],
            y: ["float"],
            vx: ["float"],
            vy: ["float"]
        },
        return: (options) => new Flick(options)
    },
    hold: {
        paramsCount: 3,
        fieldTypes: {
            time: ["int"],
            timeEnd: ["int"],
            track: ["int", "float"]
        },
        return: (options) => new Hold(options)
    },
    scenecontrol: {
        paramsCount: 4,
        fieldTypes: {
            time: ["int"],
            type: ["word"],
            param1: ["float"],
            param2: ["int"]
        },
        return: (options) => new SceneControl(options)
    },
    tap: {
        paramsCount: 2,
        fieldTypes: {
            time: ["int"],
            track: ["int", "float"]
        },
        return: (options) => new Tap(options)
    },
    timing: {
        paramsCount: 3,
        fieldTypes: {
            time: ["int"],
            bpm: ["float"],
            beats: ["float"]
        },
        return: (options) => new Timing(options)
    },
    timinggroup: {
        paramsCount: 1,
        hasChildren: true,
        fieldTypes: {
            attrs: ["word"]
        },
        return: (options, connects, children = []) => {
            const attrs = options.attrs.split("_");
            return new TimingGroup(children, attrs);
        }
    }
});