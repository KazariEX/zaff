import Aff from "../aff.js";
import { AffParserError } from "./error.js";
import {
    Arc,
    Camera,
    Hold,
    Note,
    SceneControl,
    Tap,
    Timing,
    TimingGroup
} from "../note/index.js";

const {
    parseInt: int,
    parseFloat: float
} = Number;

const re_note = /^(?<keyword>[a-zA-Z]*)\s*\((?<args>.*?)\)\s*(?<extra>.*)\s*[;|\{]$/;

function parseAll(affStr: string) {
    const affList = affStr.split("\n");
    const aff = new Aff();
    const tg1 = new TimingGroup();
    aff.addTimingGroup(tg1);

    let tgn = tg1;

    affList.forEach((line, index) => {
        line = line.trim();
        if (["", "-"].includes(line)) {
            /* なにもしない */
        }
        else if (line.startsWith("AudioOffset")) {
            aff.audioOffset = int(line.slice(line.indexOf(":") + 1, line.length));
        }
        else if (line.startsWith("TimingPointDensityFactor")) {
            aff.density = int(line.slice(line.indexOf(":") + 1, line.length));
        }
        else if (line === "};") {
            if (tgn !== tg1) {
                tgn = tg1;
            }
            else {
                throw new AffParserError(line, index);
            }
        }
        else try {
            const note = parseLine(line);
            if (note instanceof TimingGroup) {
                tgn = note;
                aff.addTimingGroup(tgn);
            }
            else {
                tgn.push(note);
            }
        }
        catch (err: any) {
            err.line = index;
            throw err;
        }
    });

    return aff;
}

function parseLine(noteStr: string) {
    const match = re_note.exec(noteStr.trim());
    if (!match) {
        throw new AffParserError(noteStr);
    }

    const {
        keyword = "",
        args = "",
        extra = ""
    } = match.groups as any;

    if (keyword === "timinggroup") {
        const attr = args.split("_");
        return new TimingGroup([], attr);
    }
    else {
        const attr = args.split(",");
        if (keyword === "") {
            return new Tap({
                time: int(attr[0]),
                track: float(attr[1])
            });
        }
        else if (keyword === "arc") {
            const arctap: Array<number> = [];
            const m: string = extra.match(/^\[(.*)\]$/)?.[1] ?? "";
            m.split(",").forEach((item) => {
                const t = item.match(/arctap\(([0-9]*)\)/)?.[1];
                if (t) {
                    arctap.push(int(t));
                }
            });
            return new Arc({
                time: int(attr[0]),
                timeEnd: int(attr[1]),
                x1: float(attr[2]),
                x2: float(attr[3]),
                easing: attr[4],
                y1: float(attr[5]),
                y2: float(attr[6]),
                color: int(attr[7]),
                hitsound: attr[8],
                skyline: attr[9] === "true",
                arctap: arctap
            });
        }
        else if (keyword === "camera") {
            return new Camera({
                time: int(attr[0]),
                x: float(attr[1]),
                y: float(attr[2]),
                z: float(attr[3]),
                xoyAngle: float(attr[4]),
                yozAngle: float(attr[5]),
                xozAngle: float(attr[6]),
                easing: attr[7],
                duration: int(attr[8])
            });
        }
        else if (keyword === "hold") {
            return new Hold({
                time: int(attr[0]),
                timeEnd: int(attr[1]),
                track: float(attr[2])
            });
        }
        else if (keyword === "scenecontrol") {
            return new SceneControl({
                time: int(attr[0]),
                sctype: attr[1],
                param1: float(attr[2]),
                param2: int(attr[3])
            });
        }
        else if (keyword === "timing") {
            return new Timing({
                time: int(attr[0]),
                bpm: float(attr[1]),
                beats: float(attr[2])
            });
        }
        else {
            throw new AffParserError(noteStr);
        }
    }
}

export {
    parseAll,
    parseLine
};