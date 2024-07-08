import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { Aff } from "@zaffjs/core";
import { parseAff } from "@zaffjs/parser";
import { countAff, countTimingGroup } from "../src/counter";

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

describe("countAff:examples", () => {
    const readAff = async (path: string) => {
        const file = await readFile(resolve(__dirname, path));
        return parseAff(file.toString());
    };

    it("arcanaeden[beyond]", async () => {
        const aff = await readAff("./examples/arcanaeden[beyond].aff");
        expect(countAff(aff)).toBe(2134);
    });

    it("pentiment[beyond]", async () => {
        const aff = await readAff("./examples/pentiment[beyond].aff");
        expect(countAff(aff)).toBe(1741);
    });

    it("testify[beyond]", async () => {
        const aff = await readAff("./examples/testify[beyond].aff");
        expect(countAff(aff)).toBe(2221);
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

    it("arc:from/to", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 233.00, 4.00),
            Aff.arc(0, 387, 0.00, 0.00, "s", 0.00, 0.00, 0, "none", false) // 2
        ]);

        /**
         * ○----●----●----○-
         * ^---^
         */
        expect(countTimingGroup(tg, {
            to: 127
        })).toBe(0);

        /**
         * ○----●----●----○-
         * ^----^
         */
        expect(countTimingGroup(tg, {
            to: 128
        })).toBe(1);

        /**
         * ○----●----●----○-
         *      ^----^
         */
        expect(countTimingGroup(tg, {
            from: 128,
            to: 257
        })).toBe(2);

        /**
         * ○----●----●----○-
         *       ^--^
         */
        expect(countTimingGroup(tg, {
            from: 129,
            to: 256
        })).toBe(0);

        /**
         * ○----●----●----○-
         *           ^-----^
         */
        expect(countTimingGroup(tg, {
            from: 257
        })).toBe(1);

        /**
         * ○----●----●----○-
         *            ^----^
         */
        expect(countTimingGroup(tg, {
            from: 258
        })).toBe(0);
    });

    it("arc:from/to with connects", () => {
        const tg = Aff.timinggroup([
            Aff.timing(0, 233.00, 4.00),
            Aff.arc(0, 0, 0.50, 1.00, "s", 0.00, 0.00, 0, "none", false),  // 0
            Aff.arc(0, 387, 1.00, 1.00, "s", 0.00, 0.00, 0, "none", false) // 2
        ]);

        /**
         * ●----●----●----○-
         * ^---^
         */
        expect(countTimingGroup(tg, {
            to: 127
        })).toBe(1);

        /**
         * ●----●----●----○-
         * ^----^
         */
        expect(countTimingGroup(tg, {
            to: 128
        })).toBe(2);

        /**
         * ●----●----●----○-
         *      ^----^
         */
        expect(countTimingGroup(tg, {
            from: 128,
            to: 257
        })).toBe(2);

        /**
         * ●----●----●----○-
         *       ^--^
         */
        expect(countTimingGroup(tg, {
            from: 129,
            to: 256
        })).toBe(0);

        /**
         * ●----●----●----○-
         *           ^-----^
         */
        expect(countTimingGroup(tg, {
            from: 257
        })).toBe(1);

        /**
         * ●----●----●----○-
         *            ^----^
         */
        expect(countTimingGroup(tg, {
            from: 258
        })).toBe(0);
    });
});