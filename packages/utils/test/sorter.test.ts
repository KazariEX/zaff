import { describe, expect, it } from "vitest";
import { Aff } from "@zaffjs/core";
import { sortTimingGroup } from "../src/sorter";

describe.skip("sortAff", () => {});

describe("sortTimingGroup", () => {
    it("mode:time", () => {
        const tg = Aff.timinggroup([
            Aff.tap({ time: 0 }),
            Aff.arc({ time: 700, timeEnd: 900 }),
            Aff.arc({ time: 300, timeEnd: 500 }),
            Aff.hold({ time: 500, timeEnd: 700 }),
            Aff.tap({ time: 100 })
        ]);
        sortTimingGroup(tg);

        expect(tg[0].time).toBe(0);
        expect(tg[1].time).toBe(100);
        expect(tg[2].time).toBe(300);
        expect(tg[3].time).toBe(500);
        expect(tg[4].time).toBe(700);
    });

    it("mode:time(consistent) should be sorted by kind", () => {
        const tg = Aff.timinggroup([
            Aff.flick({ time: 0 }),
            Aff.camera({ time: 0 }),
            Aff.arc({ time: 0, timeEnd: 200 }),
            Aff.hold({ time: 0, timeEnd: 200 }),
            Aff.tap({ time: 0 })
        ]);
        sortTimingGroup(tg);

        expect(tg[0].kind).toBe("tap");
        expect(tg[1].kind).toBe("flick");
        expect(tg[2].kind).toBe("hold");
        expect(tg[3].kind).toBe("arc");
        expect(tg[4].kind).toBe("camera");
    });

    it("mode:time(desc)", () => {
        const tg = Aff.timinggroup([
            Aff.tap({ time: 0 }),
            Aff.arc({ time: 700, timeEnd: 900 }),
            Aff.arc({ time: 300, timeEnd: 500 }),
            Aff.hold({ time: 500, timeEnd: 700 }),
            Aff.tap({ time: 100 })
        ]);
        sortTimingGroup(tg, {
            desc: true
        });

        expect(tg[0].time).toBe(700);
        expect(tg[1].time).toBe(500);
        expect(tg[2].time).toBe(300);
        expect(tg[3].time).toBe(100);
        expect(tg[4].time).toBe(0);
    });

    it("mode:kind", () => {
        const tg = Aff.timinggroup([
            Aff.flick({ time: 0 }),
            Aff.camera({ time: 700 }),
            Aff.arc({ time: 300, timeEnd: 500 }),
            Aff.hold({ time: 500, timeEnd: 700 }),
            Aff.tap({ time: 100 })
        ]);
        sortTimingGroup(tg, {
            mode: "kind"
        });

        expect(tg[0].kind).toBe("tap");
        expect(tg[1].kind).toBe("flick");
        expect(tg[2].kind).toBe("hold");
        expect(tg[3].kind).toBe("arc");
        expect(tg[4].kind).toBe("camera");
    });

    it("mode:kind(consistent) should be sorted by time", () => {
        const tg = Aff.timinggroup([
            Aff.tap({ time: 0 }),
            Aff.tap({ time: 700 }),
            Aff.tap({ time: 300 }),
            Aff.tap({ time: 500 }),
            Aff.tap({ time: 100 })
        ]);
        sortTimingGroup(tg, {
            mode: "kind"
        });

        expect(tg[0].time).toBe(0);
        expect(tg[1].time).toBe(100);
        expect(tg[2].time).toBe(300);
        expect(tg[3].time).toBe(500);
        expect(tg[4].time).toBe(700);
    });

    it("mode:kind(custom)", () => {
        const tg = Aff.timinggroup([
            Aff.flick({ time: 0 }),
            Aff.camera({ time: 700 }),
            Aff.arc({ time: 300, timeEnd: 500 }),
            Aff.hold({ time: 500, timeEnd: 700 }),
            Aff.tap({ time: 100 })
        ]);
        sortTimingGroup(tg, {
            mode: "kind",
            kinds: ["arc", "camera", "flick", "hold", "tap"]
        });

        expect(tg[0].kind).toBe("arc");
        expect(tg[1].kind).toBe("camera");
        expect(tg[2].kind).toBe("flick");
        expect(tg[3].kind).toBe("hold");
        expect(tg[4].kind).toBe("tap");
    });
});