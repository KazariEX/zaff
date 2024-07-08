export type NoteKind = "arc" | "arctap" | "camera" | "flick" | "hold" | "scenecontrol" | "tap" | "timing" | "timinggroup";

export type EasingType = "b" | "l" | "qi" | "qo" | "reset" | "s" | "si" | "so" | "sisi" | "siso" | "sosi" | "soso";

export interface EasingFunction {
    (percent: number): number;
}

export interface NoteOptions {
    time?: number;
}

export interface ArcOptions {
    time?: number;
    timeEnd?: number;
    x1?: number;
    x2?: number;
    easing?: EasingType;
    y1?: number;
    y2?: number;
    color?: number;
    hitsound?: string;
    skyline?: boolean;
    arctap?: number[];
}

export interface ArctapOptions {
    time?: number;
}

export interface CameraOptions {
    time?: number;
    x?: number;
    y?: number;
    z?: number;
    xoyAngle?: number;
    yozAngle?: number;
    xozAngle?: number;
    easing?: EasingType;
    duration?: number;
}

export interface FlickOptions {
    time?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
}

export interface HoldOptions {
    time?: number;
    timeEnd?: number;
    track?: number;
}

export interface ScenecontrolOptions {
    time?: number;
    type?: string;
    param1?: number;
    param2?: number;
}

export interface TapOptions {
    time?: number;
    track?: number;
}

export interface TimingOptions {
    time?: number;
    bpm?: number;
    beats?: number;
}