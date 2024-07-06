import { describe, expect, it } from "vitest";
import { countAff, countTimingGroup } from "../src/utils/counter";
import { Aff } from "../src/aff";

describe("countAff", () => {
    it("should connect Arcs across TimingGroups", () => {
        const aff = new Aff({
            audioOffset: 0,
            density: 1
        });

        const tg0 = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.arc(1, 1, 0.50, 1.00, "s", 0.00, 0.00, 0, "none", false)
        ]);

        const tg1 = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.arc(1, 752, 1.00, 1.00, "s", 0.00, 0.00, 0, "none", false)
        ]);

        aff.addTimingGroup(tg0, tg1);

        expect(countAff(aff)).toBe(3);
    });
});

describe("countTimingGroup", () => {
    it("tap", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.tap(0, 1), // 1
            Aff.tap(0, 2), // 1
            Aff.tap(0, 3), // 1
            Aff.tap(0, 4)  // 1
        ]);

        expect(countTimingGroup(tg)).toBe(4);
    });

    it("flick", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.flick(0, 0.00, 0.00, 1.00, 1.00),  // 1
            Aff.flick(0, 0.00, 1.00, -1.00, 1.00), // 1
            Aff.flick(0, 1.00, 0.00, 1.00, -1.00), // 1
            Aff.flick(0, 1.00, 1.00, -1.00, -1.00) // 1
        ]);

        expect(countTimingGroup(tg)).toBe(4);
    });

    it("hold", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.hold(0, 249, 1), // 1
            Aff.hold(0, 501, 1), // 1
            Aff.hold(0, 751, 1)  // 2
        ]);

        expect(countTimingGroup(tg)).toBe(4);
    });

    it("arc", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 120.00, 4.00),
            Aff.arc(0, 249, 0.00, 0.00, "s", 0.00, 0.00, 0, "none", false), // 1
            Aff.arc(0, 501, 0.00, 0.00, "s", 0.00, 0.00, 0, "none", false), // 1
            Aff.arc(0, 751, 0.00, 0.00, "s", 0.00, 0.00, 0, "none", false), // 2
            Aff.arc(1, 1, 0.50, 1.00, "s", 0.00, 0.00, 0, "none", false),   // 0
            Aff.arc(1, 752, 1.00, 1.00, "s", 0.00, 0.00, 0, "none", false), // 3
            Aff.arc(500, 501, 0.50, 0.50, "s", 0.00, 0.00, 0, "none", true, [500]) // 1
        ]);

        expect(countTimingGroup(tg)).toBe(8);
    });
});