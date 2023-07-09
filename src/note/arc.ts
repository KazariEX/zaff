import Hold from "./hold.js";
import TimingGroup from "./timinggroup.js";
import { Color, Easing } from "../enum.js";
import { getComplexCurveByEasing } from "../utils/easing.js";

class Arc extends Hold
{
    x1: number;
    x2: number;
    easing: Easing;
    y1: number;
    y2: number;
    color: Color;
    hitsound: string;
    skyline: boolean;
    arctap: Array<number>;

    constructor({
        time = 0,
        timeEnd = 0,
        x1 = 0,
        x2 = 0,
        easing = Easing.b,
        y1 = 0,
        y2 = 0,
        color = Color.blue,
        hitsound = "none",
        skyline = false,
        arctap = Array()
    } = {}) {
        super();
        this.time = time;
        this.timeEnd = timeEnd;
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

    at(t: number): Point
    {
        const percent = (t - this.time) / (this.timeEnd - this.time);
        const [cx, cy] = getComplexCurveByEasing(this.easing);

        return {
            x: this.x1 + cx(percent) * (this.x2 - this.x1),
            y: this.y1 + cy(percent) * (this.y2 - this.y1)
        };
    }

    clone(): Arc
    {
        return new Arc({
            time: this.time,
            timeEnd: this.timeEnd,
            x1: this.x1,
            x2: this.x2,
            easing: this.easing,
            y1: this.y1,
            y2: this.y2,
            color: this.color,
            hitsound: this.hitsound,
            skyline: this.skyline,
            arctap: Array.from(this.arctap)
        });
    }

    cut(count: number): TimingGroup
    {
        const tg = new TimingGroup();
        if (count === 1) {
            tg.push(this.clone());
        }
        else if (count > 1) {
            const st = (this.timeEnd - this.time) / count;
            const [cx, cy] = getComplexCurveByEasing(this.easing);

            const last = {
                x: this.x1,
                y: this.y1
            };
            const next = {
                x: 0,
                y: 0
            };
            for (let i = 0; i < count; i++) {
                const percent = (i + 1) / count;
                next.x = this.x1 + cx(percent) * (this.x2 - this.x1);
                next.y = this.y1 + cy(percent) * (this.y2 - this.y1);
                tg.push(new Arc({
                    time: this.time + i * st,
                    timeEnd: this.time + (i + 1) * st,
                    x1: last.x,
                    x2: next.x,
                    easing: Easing.s,
                    y1: last.y,
                    y2: next.y,
                    color: this.color,
                    hitsound: this.hitsound,
                    skyline: this.skyline,
                    arctap: []
                }));
                last.x = next.x;
                last.y = next.y;
            }
        }
        return tg;
    }

    mirror(): this
    {
        this.x1 = 0.5 - this.x1;
        this.x2 = 0.5 - this.x2;
        return this;
    }

    speedAs(rate: number): this
    {
        super.speedAs(rate);
        for (let i = 0; i < this.arctap.length; i++) {
            this.arctap[i] = Math.round(this.arctap[i] / rate);
        }
        return this;
    }

    toString(): string
    {
        let arctap = "";
        if (this.arctap?.length > 0) {
            arctap = `[${
                this.arctap.map(item => {
                    return `arctap(${Math.floor(item)})`;
                }).join(",")
            }]`;
        }

        return "arc({1},{2},{3},{4},{5},{6},{7},{8},{9},{10}){11};".arg(
            Math.floor(this.time),
            Math.floor(this.timeEnd),
            this.x1.toFixed(2),
            this.x2.toFixed(2),
            this.easing,
            this.y1.toFixed(2),
            this.y2.toFixed(2),
            this.color,
            this.hitsound,
            this.skyline,
            arctap
        );
    }
}

export default Arc;