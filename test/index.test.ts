import { expect, test } from "vitest";
import { Aff } from "../src/index";

test("tap", () => {
    const tap = Aff.tap(200, 1);
    expect(tap.toString()).toBe("(200,1);");

    tap.mirror();
    expect(tap.toString()).toBe("(200,4);");

    tap.moveBy(256);
    expect(tap.toString()).toBe("(456,4);");

    tap.moveTo(1024);
    expect(tap.toString()).toBe("(1024,4);");

    tap.speedAs(2);
    expect(tap.toString()).toBe("(512,4);");

    const taptap = tap.clone();
    expect(taptap.toString()).toBe("(512,4);");
});