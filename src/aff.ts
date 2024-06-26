import { text2Aff } from "./ast";
import {
    Arc,
    Camera,
    Flick,
    Hold,
    Note,
    SceneControl,
    Tap,
    Timing,
    TimingGroup
} from "./note";

export class Aff {
    audioOffset: number;
    density: number;
    length: number = 0;
    [key: number]: TimingGroup;

    constructor({
        audioOffset = 0,
        density = 1
    } = {}) {
        this.audioOffset = audioOffset;
        this.density = density;
    }

    // 迭代器
    [Symbol.iterator]() {
        const that = this;
        let index: number = 0;
        return {
            next() {
                return {
                    value: that[index++],
                    done: index > that.length
                };
            }
        };
    }

    // 添加时间组
    addTimingGroup(tg: TimingGroup) {
        this[this.length++] = tg;
        return this;
    }

    // 删除时间组
    removeTimingGroup(index: number) {
        // 无时间组
        if (this.length === 0) {
            return void(0);
        }
        // 负索引处理
        index %= this.length;
        if (index < 0) index += this.length;
        this.length--;

        // 左移
        const tg = this[index];
        for (let i = index; i < this.length; i++) {
            this[i] = this[i + 1];
        }
        // 尾删
        delete this[this.length];
        return tg;
    }

    // 谱面镜像
    mirror() {
        [...this].forEach((tg) => tg.mirror());
        return this;
    }

    // 谱面偏移
    offsetBy(offset: number) {
        this.audioOffset += offset;
        return this;
    }

    // 谱面排序
    sort() {
        [...this].forEach((tg) => {
            tg.sort((a: Note, b: Note) => a.time - b.time);
        });
        return this;
    }

    // 谱面变速
    speedAs(rate: number) {
        [...this].forEach((tg) => {
            tg.speedAs(rate);
        });
        return this;
    }

    // 谱面对象序列化
    stringify() {
        const aff: string[] = [];

        // 文件头
        aff.push("AudioOffset:" + Math.floor(this.audioOffset));
        if (this.density !== 1) {
            aff.push("TimingPointDensityFactor:" + this.density);
        }
        aff.push("-");

        // 谱面内容
        [...this].forEach((tg: TimingGroup, index: number) => {
            aff.push(tg.toString(index !== 0));
        });

        return aff.join("\n");
    }

    // 格式字符串解析
    static parse(affStr: string) {
        return text2Aff(affStr);
    }

    // 生成Arc
    static arc(options: ArcOptions): Arc;
    static arc(time: number, timeEnd: number, x1: number, x2: number, easing: EasingType, y1: number, y2: number, color: number, hitsound: string, skyline: boolean, arctap?: number[]): Arc;
    static arc(timeOrOptions: any, timeEnd?: number, x1?: number, x2?: number, easing?: EasingType, y1?: number, y2?: number, color?: number, hitsound?: string, skyline?: boolean, arctap?: number[]) {
        if (typeof arguments[0] === "object") {
            return new Arc(timeOrOptions);
        }
        else {
            return new Arc({
                time: timeOrOptions,
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
    }

    // 生成Camera
    static camera(options: CameraOptions): Camera;
    static camera(time: number, x: number, y: number, z: number, xoyAngle: number, yozAngle: number, xozAngle: number, easing: EasingType, duration: number): Camera;
    static camera(timeOrOptions: any, x?: number, y?: number, z?: number, xoyAngle?: number, yozAngle?: number, xozAngle?: number, easing?: EasingType, duration?: number) {
        if (typeof arguments[0] === "object") {
            return new Camera(timeOrOptions);
        }
        else {
            return new Camera({
                time: timeOrOptions,
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
    }

    // 生成Flick
    static flick(options: FlickOptions): Flick;
    static flick(time: number, x: number, y: number, vx: number, vy: number): Flick;
    static flick(timeOrOptions: any, x?: number, y?: number, vx?: number, vy?: number) {
        if (typeof arguments[0] === "object") {
            return new Flick(timeOrOptions);
        }
        else {
            return new Flick({
                time: timeOrOptions,
                x,
                y,
                vx,
                vy
            });
        }
    }

    // 生成Hold
    static hold(options: HoldOptions): Hold;
    static hold(time: number, timeEnd: number, track: number): Hold;
    static hold(timeOrOptions: any, timeEnd?: number, track?: number) {
        if (typeof arguments[0] === "object") {
            return new Hold(timeOrOptions);
        }
        else {
            return new Hold({
                time: timeOrOptions,
                timeEnd,
                track
            });
        }
    }

    // 生成Scenecontrol
    static scenecontrol(options: ScenecontrolOptions): SceneControl;
    static scenecontrol(time: number, type: string, param1: number, param2: number): SceneControl;
    static scenecontrol(timeOrOptions: any, type?: string, param1?: number, param2?: number) {
        if (typeof arguments[0] === "object") {
            return new SceneControl(timeOrOptions);
        }
        else {
            return new SceneControl({
                time: timeOrOptions,
                type,
                param1,
                param2
            });
        }
    }

    // 生成Tap
    static tap(options: TapOptions): Tap;
    static tap(time: number, track: number): Tap;
    static tap(timeOrOptions: any, track?: number) {
        if (typeof arguments[0] === "object") {
            return new Tap(timeOrOptions);
        }
        else {
            return new Tap({
                time: timeOrOptions,
                track
            });
        }
    }

    // 生成Timing
    static timing(options: TimingOptions): Timing;
    static timing(time: number, bpm: number, beats: number): Timing;
    static timing(timeOrOptions: any, bpm?: number, beats?: number) {
        if (typeof arguments[0] === "object") {
            return new Timing(timeOrOptions);
        }
        else {
            return new Timing({
                time: timeOrOptions,
                bpm,
                beats
            });
        }
    }

    // 生成TimingGroup
    static timinggroup(noteList: Note[] = [], options: string[] = []) {
        return new TimingGroup(noteList, options);
    }
}