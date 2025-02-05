import { getBiaxialCurves } from "../utils/easing";
import { Hold } from "./hold";
import { TimingGroup } from "./timinggroup";
import type { ArcOptions, EasingFunction, EasingType, NoteKind } from "../types";
import type { Note } from "./note";

export class Arc extends Hold {
    x1: number;
    x2: number;
    easing: EasingType;
    y1: number;
    y2: number;
    color: number;
    hitsound: string;
    skyline: boolean;
    arctap: number[];

    constructor({
        time = 0,
        timeEnd = 0,
        x1 = 0,
        x2 = 0,
        easing = "s",
        y1 = 0,
        y2 = 0,
        color = 0,
        hitsound = "none",
        skyline = false,
        arctap = []
    }: ArcOptions = {}) {
        super({ time, timeEnd });
        this.x1 = x1;
        this.x2 = x2;
        this.easing = easing;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.hitsound = hitsound;
        this.skyline = skyline;
        this.arctap = arctap;
    }

    at(t: number, { cx, cy }: {
        cx?: EasingFunction;
        cy?: EasingFunction;
    } = {}) {
        const percent = (t - this.time) / (this.timeEnd - this.time);
        const [_cx, _cy] = getBiaxialCurves(this.easing);
        cx ??= _cx;
        cy ??= _cy;

        return {
            x: this.x1 + cx(percent) * (this.x2 - this.x1),
            y: this.y1 + cy(percent) * (this.y2 - this.y1)
        };
    }

    override clone({
        time = this.time,
        timeEnd = this.timeEnd,
        x1 = this.x1,
        x2 = this.x2,
        easing = this.easing,
        y1 = this.y1,
        y2 = this.y2,
        color = this.color,
        hitsound = this.hitsound,
        skyline = this.skyline,
        arctap = Array.from(this.arctap)
    }: ArcOptions = {}) {
        return new Arc({
            time,
            timeEnd,
            x1,
            x2,
            easing,
            y1,
            y2,
            color,
            hitsound,
            skyline,
            arctap
        });
    }

    cut(count: number, { start = this.time, end = this.timeEnd, ender = false, cx, cy }: {
        start?: number;
        end?: number;
        ender?: boolean;
        cx?: EasingFunction;
        cy?: EasingFunction;
    } = {}) {
        const tg = new TimingGroup();
        if (count >= 1) {
            // 模板音弧
            const sample = this.clone();
            sample.easing = "s";
            sample.arctap = [];

            // 时间范围限定
            start = Math.max(this.time, Math.min(this.timeEnd, start));
            end = Math.max(this.time, Math.min(this.timeEnd, end));
            if (start > end) [start, end] = [end, start];
            sample.time = start;
            sample.timeEnd = end;

            // 起点&终点坐标
            const p1 = this.at(start, { cx, cy });
            const p2 = this.at(end, { cx, cy });
            sample.x1 = p1.x;
            sample.y1 = p1.y;
            sample.x2 = p2.x;
            sample.y2 = p2.y;

            if (count === 1) {
                tg.push(sample);
            }
            else {
                const st = (sample.timeEnd - sample.time) / count;
                const [_cx, _cy] = getBiaxialCurves(this.easing);
                cx ??= _cx;
                cy ??= _cy;

                const per_s = (sample.time - this.time) / this.duration;
                const per_d = (sample.timeEnd - sample.time) / this.duration;

                const last = {
                    x: sample.x1,
                    y: sample.y1
                };
                const next = {
                    x: 0,
                    y: 0
                };
                for (let i = 0; i < count; i++) {
                    const percent = per_s + per_d * (i + 1) / count;
                    next.x = this.x1 + cx(percent) * (this.x2 - this.x1);
                    next.y = this.y1 + cy(percent) * (this.y2 - this.y1);
                    tg.push(new Arc({
                        time: sample.time + i * st,
                        timeEnd: sample.time + (i + 1) * st,
                        x1: last.x,
                        x2: next.x,
                        easing: "s",
                        y1: last.y,
                        y2: next.y,
                        color: sample.color,
                        hitsound: sample.hitsound,
                        skyline: sample.skyline
                    }));
                    last.x = next.x;
                    last.y = next.y;
                }
            }

            // 两端音弧
            if (ender) {
                if (start > this.time) {
                    tg.unshift(this.clone({
                        timeEnd: start,
                        x2: p1.x,
                        easing: "s",
                        y2: p1.y,
                        arctap: []
                    }));
                }
                if (end < this.timeEnd) {
                    tg.push(this.clone({
                        time: end,
                        x1: p2.x,
                        easing: "s",
                        y1: p2.y,
                        arctap: []
                    }));
                }
            }
        }
        return tg;
    }

    override mirror() {
        this.x1 = 1 - this.x1;
        this.x2 = 1 - this.x2;
        const { color } = this;
        this.color = color === 0 ? 1 : color === 1 ? 0 : color;
        return this;
    }

    override moveBy(t: number) {
        super.moveBy(t);
        this.arctap = this.arctap.map((val) => val + t);
        return this;
    }

    override moveTo(t: number) {
        this.arctap = this.arctap.map((val) => val + t - this.time);
        super.moveTo(t);
        return this;
    }

    override speedAs(rate: number) {
        super.speedAs(rate);
        for (let i = 0; i < this.arctap.length; i++) {
            this.arctap[i] = Math.round(this.arctap[i] / rate);
        }
        return this;
    }

    override toString() {
        let arctap = "";
        if (this.arctap?.length > 0) {
            arctap = `[${
                this.arctap.map((item) => {
                    return `arctap(${Math.floor(item)})`;
                }).join(",")
            }]`;
        }

        return `arc(${
            Math.floor(this.time)
        },${
            Math.floor(this.timeEnd)
        },${
            this.x1.toFixed(2)
        },${
            this.x2.toFixed(2)
        },${
            this.easing
        },${
            this.y1.toFixed(2)
        },${
            this.y2.toFixed(2)
        },${
            this.color
        },${
            this.hitsound
        },${
            this.skyline
        })${
            arctap
        };`;
    }

    override get kind(): NoteKind {
        return "arc";
    }

    static override is(note: Note): note is Arc {
        return note.kind === "arc";
    }
}