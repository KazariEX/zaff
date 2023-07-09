import { Easing } from "../enum.js";

type EasingFunction = {
    (percent: number): number
};

function linear(percent: number): number
{
    return percent;
}

function sineIn(percent: number): number
{
    return Math.sin(percent * Math.PI / 2);
}

function sineOut(percent: number): number
{
    return 1 - Math.cos(percent * Math.PI / 2);
}

const bezier = createBezier(1 / 3, 0, 2 / 3, 1);

// https://github.com/WebKit/webkit/blob/main/Source/WebCore/platform/graphics/UnitBezier.h
function createBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction
{
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    return function (percent: number): number
    {
        return sampleCurveY(solveCurveX(percent));
    };

    function solveCurveX(x: number): number
    {
        let t0 = 0;
        let t1 = 1
        let t2 = x;
        let x2 = 0;
        let d2 = 0;

        for (let i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < 1e-6) return t2;
            d2 = sampleCurveDerivativeX(t2);
            if (Math.abs(d2) < 1e-6) break;
            t2 = t2 - x2 / d2;
        }

        t2 = x;
        if (t2 < t0) return t0;
        if (t2 > t1) return t1;

        while (t0 < t1) {
            x2 = sampleCurveX(t2);
            if (Math.abs(x2 - x) < 1e-6) return t2;
            if (x > x2) t0 = t2;
            else t1 = t2;
            t2 = (t1 + t0) * 0.5;
        }

        return t2;
    }

    function sampleCurveX(t: number): number
    {
        return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t: number): number
    {
        return ((ay * t + by) * t + cy) * t;
    }

    function sampleCurveDerivativeX(t: number): number
    {
        return (3.0 * ax * t + 2.0 * bx) * t + cx;
    }
}

function getCurveByEasing(e: Easing): EasingFunction
{
    if (e === Easing.b) {
        return bezier;
    }
    else if (e === Easing.si) {
        return sineIn;
    }
    else if (e === Easing.so) {
        return sineOut;
    }
    else {
        return linear;
    }
}

function getComplexCurveByEasing(e: Easing): [EasingFunction, EasingFunction]
{
    let cx = linear;
    let cy = linear;

    if (e === Easing.b) {
        cx = bezier;
    }
    else {
        if (e === Easing.si || e === Easing.sisi || e === Easing.siso) {
            cx = sineIn;
        }
        else if (e === Easing.so || e === Easing.sosi || e === Easing.soso) {
            cx = sineOut;
        }

        if (e === Easing.sisi || e === Easing.sosi) {
            cy = sineIn;
        }
        else if (e === Easing.siso || e === Easing.soso) {
            cy = sineOut;
        }
    }

    return [cx, cy];
}

export {
    linear,
    sineIn,
    sineOut,
    bezier,
    createBezier,
    getCurveByEasing,
    getComplexCurveByEasing
};