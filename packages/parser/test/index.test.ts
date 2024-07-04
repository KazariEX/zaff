import { describe, expect, it } from "vitest";
import { parse, parseInline } from "../src";

describe("parse", () => {
    it("meta", () => {
        const text =
`AudioOffset: 200
TimingPointDensityFactor: 1.5
-
`;
        const aff = parse(text);
        expect(aff.audioOffset).toBe(200);
        expect(aff.density).toBe(1.5);
    });
});

describe("parseInline", () => {
    it("tap", () => {
        const text = "(200,1);";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("hold", () => {
        const text = "hold(200,400,1);";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("arc", () => {
        const text = "arc(200,400,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(233),arctap(250),arctap(386)];";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("flick", () => {
        const text = "flick(200,0.00,0.00,1.00,1.00);";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("timing", () => {
        const text = "timing(200,120.00,4.00);";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("camera", () => {
        const text = "camera(200,120.00,150.00,180.00,30.00,60.00,90.00,s,200);";
        const note = parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("timinggroup:empty", () => {
        const text = "timinggroup(){\n  \n};";
        const note = parseInline(text);
        expect(note.toString(true)).toBe(text);
    });

    it("timinggroup", () => {
        const text = `timinggroup(noinput_anglex233){
  timing(200,120.00,4.00);
  (200,1);
  hold(200,400,1);
};`;
        const note = parseInline(text);
        expect(note.toString(true)).toBe(text);
    });
});