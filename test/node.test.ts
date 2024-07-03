import { describe, expect, it } from "vitest";
import { Aff } from "../src";

describe("tap", () => {
    const create = () => Aff.tap(200, 1);

    it("clone", () => {
        const tap = create();
        const copy = tap.clone();
        expect(copy.toString()).toBe("(200,1);");
    });

    it("mirror", () => {
        const tap = create();
        tap.mirror();
        expect(tap.toString()).toBe("(200,4);");
    });

    it("moveBy", () => {
        const tap = create();
        tap.moveBy(256);
        expect(tap.toString()).toBe("(456,1);");
    });

    it("moveTo", () => {
        const tap = create();
        tap.moveTo(1024);
        expect(tap.toString()).toBe("(1024,1);");
    });

    it("speedAs", () => {
        const tap = create();
        tap.speedAs(2);
        expect(tap.toString()).toBe("(100,1);");
    });
});

describe("hold", () => {
    const create = () => Aff.hold(200, 400, 1);

    it("clone", () => {
        const hold = create();
        const copy = hold.clone();
        expect(copy.toString()).toBe("hold(200,400,1);");
    });

    it("moveBy", () => {
        const hold = create();
        hold.moveBy(256);
        expect(hold.toString()).toBe("hold(456,656,1);");
    });

    it("moveTo", () => {
        const hold = create();
        hold.moveTo(1024);
        expect(hold.toString()).toBe("hold(1024,1224,1);");
    });

    it("speedAs", () => {
        const hold = create();
        hold.speedAs(2);
        expect(hold.toString()).toBe("hold(100,200,1);");
    });
});

describe("arc", () => {
    const create = () => Aff.arc(200, 400, 0.00, 1.00, "sisi", 0.00, 1.00, 0, "none", true, [233, 250, 386]);

    it("clone", () => {
        const arc = create();
        const copy = arc.clone();
        expect(copy.toString()).toBe("arc(200,400,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(233),arctap(250),arctap(386)];");
    });

    it("mirror", () => {
        const arc = create();
        arc.mirror();
        expect(arc.toString()).toBe("arc(200,400,1.00,0.00,sisi,0.00,1.00,1,none,true)[arctap(233),arctap(250),arctap(386)];");
    });

    it("moveBy", () => {
        const arc = create();
        arc.moveBy(256);
        expect(arc.toString()).toBe("arc(456,656,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(489),arctap(506),arctap(642)];");
    });

    it("moveTo", () => {
        const arc = create();
        arc.moveTo(1024);
        expect(arc.toString()).toBe("arc(1024,1224,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(1057),arctap(1074),arctap(1210)];");
    });

    it("speedAs", () => {
        const arc = create();
        arc.speedAs(2);
        expect(arc.toString()).toBe("arc(100,200,0.00,1.00,sisi,0.00,1.00,0,none,true)[arctap(117),arctap(125),arctap(193)];");
    });

    it("cut:full", () => {
        const arc = create();
        const tg1 = arc.cut(8);
        expect(tg1.length).toBe(8);
        expect(tg1[0].toString()).toBe("arc(200,225,0.00,0.20,s,0.00,0.20,0,none,true);");
        expect(tg1[7].toString()).toBe("arc(375,400,0.98,1.00,s,0.98,1.00,0,none,true);");
    });

    it("cut:part", () => {
        const arc = create();
        const tg1 = arc.cut(4, {
            start: 250,
            end: 350,
            ender: true
        });
        expect(tg1.length).toBe(6);
    });
});

describe("flick", () => {
    const create = () => Aff.flick(200, 0.00, 0.00, 1.00, 1.00);

    it("clone", () => {
        const flick = create();
        const copy = flick.clone();
        expect(copy.toString()).toBe("flick(200,0.00,0.00,1.00,1.00);");
    });

    it("mirror", () => {
        const flick = create();
        flick.mirror();
        expect(flick.toString()).toBe("flick(200,1.00,0.00,-1.00,1.00);");
    });
});

describe("timing", () => {
    const create = () => Aff.timing(200, 120.00, 4.00);

    it("clone", () => {
        const timing = create();
        const copy = timing.clone();
        expect(copy.toString()).toBe("timing(200,120.00,4.00);");
    });

    it("speedAs", () => {
        const timing = create();
        timing.speedAs(2);
        expect(timing.toString()).toBe("timing(100,240.00,4.00);");
    });
});

describe("camera", () => {
    const create = () => Aff.camera(200, 120.00, 150.00, 180.00, 30.00, 60.00, 90.00, "s", 200);

    it("clone", () => {
        const camera = create();
        const copy = camera.clone();
        expect(copy.toString()).toBe("camera(200,120.00,150.00,180.00,30.00,60.00,90.00,s,200);");
    });

    it("mirror", () => {
        const camera = create();
        camera.mirror();
        expect(camera.toString()).toBe("camera(200,-120.00,150.00,180.00,-30.00,60.00,-90.00,s,200);");
    });
});

describe("timinggroup", () => {
    const create = () => Aff.timinggroup([
        Aff.tap(200, 1),
        Aff.hold(200, 400, 1),
        Aff.arc(200, 400, 0.00, 1.00, "sisi", 0.00, 1.00, 0, "none", true, [233, 250, 386])
    ], ["noinput", "anglex200", "angley300"]);

    it("mirror", () => {
        const tg0 = create();
        const tg1 = create();
        const observed = tg0.mirror().toString();
        const separated = tg1.map((note) => note.mirror().toString()).join("\n");
        expect(observed).toBe(separated);
    });

    it("moveBy", () => {
        const tg0 = create();
        const tg1 = create();
        const observed = tg0.moveBy(256).toString();
        const separated = tg1.map((note) => note.moveBy(256).toString()).join("\n");
        expect(observed).toBe(separated);
    });

    it("speedAs", () => {
        const tg0 = create();
        const tg1 = create();
        const observed = tg0.speedAs(2).toString();
        const separated = tg1.map((note) => note.speedAs(2).toString()).join("\n");
        expect(observed).toBe(separated);
    });

    it("toString:outer", () => {
        const tg = create();
        const lines = tg.toString(true).split("\n");
        expect(lines.at(0)).toBe("timinggroup(noinput_anglex200_angley300){");
        expect(lines.at(-1)).toBe("};");
    });
});