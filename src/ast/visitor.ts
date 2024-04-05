import type { CstChildrenDictionary, CstNodeLocation, IToken, TokenType } from "chevrotain";
import type { AFFError } from "./types";
import { createFactory } from "./factory";
import { tokenTypes } from "./lexer";
import { BaseVisitor } from "./parser";
import { locationFromToken } from "./utils";
import { Aff } from "../aff";
import { Arc, Arctap, Camera, Flick, Hold, Note, SceneControl, Tap, Timing, TimingGroup } from "../note";

class Visitor extends BaseVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    aff(ctx: CstChildrenDictionary, errors: AffError[]): Aff {
        const aff = new Aff();

        const meta = this.visit(ctx.head[0], errors);
        Object.assign(aff, meta);

        const notes = (
            this.visit(ctx.body[0], errors) as Note[]
        ).filter(Boolean);

        const tg0 = new TimingGroup(notes.filter((note) => note.kind !== "timinggroup"));
        const tgs = notes.filter((note) => note.kind === "timinggroup");
        for (const tg of [tg0, ...tgs]) {
            aff.addTimingGroup(tg);
        }

        return aff;
    }

    head(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return Object.fromEntries(
            ctx.meta?.map((meta) => this.visit(meta, errors)).filter(([key]) => key) || []
        );
    }

    meta(ctx: CstChildrenDictionary, errors: AFFError[]) {
        const key = {
            AudioOffset: "audioOffset",
            TimingPointDensityFactor: "density"
        }[ctx.word[0].image] || (
            errors.push({
                message: `Meta with key "${ctx.word[0].image}" is invalid`,
                location: locationFromToken(ctx.word[0])
            }), void(0)
        );
        const value = Number.parseFloat(ctx.value[0].image);
        return [key, value];
    }

    body(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return ctx.item?.map((item) => this.visit(item, errors)) || [];
    }

    item(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return this.visit(ctx.note[0], errors);
    }

    note(ctx: CstChildrenDictionary, errors: AFFError[]) {
        const kind = ctx.word?.[0].image || "tap";
        const params = this.visit(ctx.params[0], errors);
        const connects = this.visit(ctx.connects?.[0], errors);
        const children = this.visit(ctx.children?.[0], errors);

        if (kind in factory) {
            return factory[kind](errors, ctx, params, connects, children);
        }
        else {
            errors.push({
                message: `Unknown note type "${kind}"`,
                location: locationFromToken(ctx.word[0])
            });
        }
    }

    params(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return ctx.value;
    }

    connects(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return ctx.note?.map((note) => this.visit(note, errors)) || [];
    }

    children(ctx: CstChildrenDictionary, errors: AFFError[]) {
        return this.visit(ctx.body[0], errors);
    }
}

// 处理与生成物件
const factory = createFactory({
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
            sctype: ["word"],
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
            sctype: ["word"]
        },
        return: (options, connects, children = []) => {
            const attrs = options.sctype.split("_");
            return new TimingGroup(children, attrs);
        }
    }
});

export const visitor = new Visitor();