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

test("hold", () => {
    const hold = Aff.hold(200, 400, 1);
    expect(hold.toString()).toBe("hold(200,400,1);");

    hold.mirror();
    expect(hold.toString()).toBe("hold(200,400,4);");

    hold.moveBy(256);
    expect(hold.toString()).toBe("hold(456,656,4);");

    hold.moveTo(1024);
    expect(hold.toString()).toBe("hold(1024,1224,4);");

    hold.speedAs(2);
    expect(hold.toString()).toBe("hold(512,612,4);");

    const holder = hold.clone();
    expect(holder.toString()).toBe("hold(512,612,4);");
});

test("arc", () => {
    const arc = Aff.arc(200, 400, 0.00, 1.00, "sisi", 0.00, 1.00, 0, "none", false);
    expect(arc.toString()).toBe("arc(200,400,0.00,1.00,sisi,0.00,1.00,0,none,false);");

    arc.mirror();
    expect(arc.toString()).toBe("arc(200,400,1.00,0.00,sisi,0.00,1.00,1,none,false);");

    const tg1 = arc.cut(8);
    expect(tg1.length).toBe(8);
    expect(tg1[0].toString()).toBe("arc(200,225,1.00,0.80,s,0.00,0.20,1,none,false);");

    const tg2 = arc.cut(4, {
        start: 250,
        end: 350,
        ender: true
    });
    expect(tg2.length).toBe(6);

    arc.skyline = true;
    arc.arctap = [233, 250, 386];
    expect(arc.toString()).toBe("arc(200,400,1.00,0.00,sisi,0.00,1.00,1,none,true)[arctap(233),arctap(250),arctap(386)];");

    const arcaea = arc.clone();
    expect(arcaea.toString()).toBe("arc(200,400,1.00,0.00,sisi,0.00,1.00,1,none,true)[arctap(233),arctap(250),arctap(386)];");
});