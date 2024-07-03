import { describe, expect, it } from "vitest";
import { Aff } from "../src";

describe("aff", () => {
    it("parse:meta", () => {
        const text =
`AudioOffset: 200
TimingPointDensityFactor: 1.5
-
`;
        const aff = Aff.parse(text);
        expect(aff.audioOffset).toBe(200);
        expect(aff.density).toBe(1.5);
    });

    it("parseInline:tap", () => {
        const text = "(200,1);";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("parseInline:hold", () => {
        const text = "hold(200,400,1);";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("parseInline:arc", () => {
        const text = "arc(200,400,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(233),arctap(250),arctap(386)];";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("parseInline:flick", () => {
        const text = "flick(200,0.00,0.00,1.00,1.00);";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("parseInline:timing", () => {
        const text = "timing(200,120.00,4.00);";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });

    it("parseInline:camera", () => {
        const text = "camera(200,120.00,150.00,180.00,30.00,60.00,90.00,s,200);";
        const note = Aff.parseInline(text);
        expect(note.toString()).toBe(text);
    });
});