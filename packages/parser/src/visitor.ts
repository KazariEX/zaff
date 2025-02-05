import { Aff, Note, TimingGroup } from "@zaffjs/core";
import { factory } from "./factory";
import { BaseVisitor } from "./parser";
import { locationFromToken } from "./utils";
import type { AFFError, ResolveCstNodes, ResolveITokens } from "./types";

class Visitor extends BaseVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    aff(ctx: ResolveCstNodes<"head" | "body">, errors: AFFError[]): Aff {
        const aff = new Aff();

        const meta = this.visit(ctx.head[0], errors);
        Object.assign(aff, meta);

        const notes = (
            this.visit(ctx.body[0], errors) as (Note | TimingGroup)[]
        ).filter(Boolean);

        const tg0 = new TimingGroup(notes.filter((note) => note instanceof Note));
        const tgs = notes.filter((note) => note instanceof TimingGroup);
        for (const tg of [tg0, ...tgs]) {
            aff.addTimingGroup(tg);
        }

        return aff;
    }

    head(ctx: ResolveCstNodes<"meta">, errors: AFFError[]) {
        return Object.fromEntries(
            ctx.meta?.map((meta) => this.visit(meta, errors)).filter(([key]) => key) || []
        );
    }

    meta(ctx: ResolveITokens<"word" | "value">, errors: AFFError[]) {
        const key = {
            AudioOffset: "audioOffset",
            TimingPointDensityFactor: "density"
        }[ctx.word[0].image] || (
            errors.push({
                message: `Meta with key "${ctx.word[0].image}" is invalid`,
                location: locationFromToken(ctx.word[0])
            }), void 0
        );
        const value = Number.parseFloat(ctx.value[0].image);
        return [key, value];
    }

    body(ctx: ResolveCstNodes<"item">, errors: AFFError[]) {
        return ctx.item?.map((item) => this.visit(item, errors)) || [];
    }

    item(ctx: ResolveCstNodes<"note">, errors: AFFError[]) {
        return this.visit(ctx.note[0], errors);
    }

    note(ctx: ResolveCstNodes<"params" | "connects" | "children"> & ResolveITokens<"word">, errors: AFFError[]) {
        const kind = ctx.word?.[0].image || "tap";
        const params = this.visit(ctx.params[0], errors) ?? [];
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

    params(ctx: ResolveITokens<"value">, errors: AFFError[]) {
        return ctx.value;
    }

    connects(ctx: ResolveCstNodes<"note">, errors: AFFError[]) {
        return ctx.note?.map((note) => this.visit(note, errors)) || [];
    }

    children(ctx: ResolveCstNodes<"body">, errors: AFFError[]) {
        return this.visit(ctx.body[0], errors);
    }
}

export const visitor = new Visitor();