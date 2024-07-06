import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { countAff } from "../packages/core/src";
import { parseAff } from "../packages/parser/src";

describe("countAff", () => {
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