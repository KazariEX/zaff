import { Arc, Camera, Flick, Hold, type Note, SceneControl, Tap, Timing, TimingGroup } from "./note";
import type {
    ArcOptions,
    CameraOptions,
    EasingType,
    FlickOptions,
    HoldOptions,
    ScenecontrolOptions,
    TapOptions,
    TimingOptions
} from "./types";

/* eslint-disable no-dupe-class-members */
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
        let index = 0;
        return {
            next: () => {
                return {
                    value: this[index++],
                    done: index > this.length
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
            return void 0;
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
            tg.sort((a, b) => a.time - b.time);
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

    toString() {
        const aff: string[] = [];

        // 文件头
        aff.push("AudioOffset:" + Math.floor(this.audioOffset));
        if (this.density !== 1) {
            aff.push("TimingPointDensityFactor:" + this.density);
        }
        aff.push("-");

        // 谱面内容
        [...this].forEach((tg, index) => {
            aff.push(tg.toString(index !== 0));
        });

        return aff.join("\n");
    }

    // 生成Arc
    static arc(options: ArcOptions): Arc;
    static arc(time: number, timeEnd: number, x1: number, x2: number, easing: EasingType, y1: number, y2: number, color: number, hitsound: string, skyline: boolean, arctap?: number[]): Arc;
    static arc(arg0: any, timeEnd?: number, x1?: number, x2?: number, easing?: EasingType, y1?: number, y2?: number, color?: number, hitsound?: string, skyline?: boolean, arctap?: number[]) {
        if (typeof arg0 === "object") {
            return new Arc(arg0);
        }
        else {
            return new Arc({
                time: arg0,
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
    static camera(arg0: any, x?: number, y?: number, z?: number, xoyAngle?: number, yozAngle?: number, xozAngle?: number, easing?: EasingType, duration?: number) {
        if (typeof arg0 === "object") {
            return new Camera(arg0);
        }
        else {
            return new Camera({
                time: arg0,
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
    static flick(arg0: any, x?: number, y?: number, vx?: number, vy?: number) {
        if (typeof arg0 === "object") {
            return new Flick(arg0);
        }
        else {
            return new Flick({
                time: arg0,
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
    static hold(arg0: any, timeEnd?: number, track?: number) {
        if (typeof arg0 === "object") {
            return new Hold(arg0);
        }
        else {
            return new Hold({
                time: arg0,
                timeEnd,
                track
            });
        }
    }

    // 生成Scenecontrol
    static scenecontrol(options: ScenecontrolOptions): SceneControl;
    static scenecontrol(time: number, type: string, param1: number, param2: number): SceneControl;
    static scenecontrol(arg0: any, type?: string, param1?: number, param2?: number) {
        if (typeof arg0 === "object") {
            return new SceneControl(arg0);
        }
        else {
            return new SceneControl({
                time: arg0,
                type,
                param1,
                param2
            });
        }
    }

    // 生成Tap
    static tap(options: TapOptions): Tap;
    static tap(time: number, track: number): Tap;
    static tap(arg0: any, track?: number) {
        if (typeof arg0 === "object") {
            return new Tap(arg0);
        }
        else {
            return new Tap({
                time: arg0,
                track
            });
        }
    }

    // 生成Timing
    static timing(options: TimingOptions): Timing;
    static timing(time: number, bpm: number, beats: number): Timing;
    static timing(arg0: any, bpm?: number, beats?: number) {
        if (typeof arg0 === "object") {
            return new Timing(arg0);
        }
        else {
            return new Timing({
                time: arg0,
                bpm,
                beats
            });
        }
    }

    // 生成TimingGroup
    static timinggroup(noteList: Note[] = [], attributes: string[] = []) {
        return new TimingGroup(noteList, attributes);
    }
}