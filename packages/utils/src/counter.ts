import { type Aff, Arc, Flick, Hold, Tap, Timing, type TimingGroup } from "@zaffjs/core";

export interface CountAffOptions {
    from?: number;
    to?: number;
}

export interface CountTimingGroupOptions {
    from?: number;
    to?: number;
    density?: number;
    connects?: Arc[];
}

export function countAff(aff: Aff, options: CountAffOptions = {}) {
    const tgs = aff.timingGroups;

    return tgs.reduce((res, tg) => {
        const connects = tgs
            .filter((tgn) => tg !== tgn)
            .flatMap((tgn) => tgn.filter(Arc.is));

        return res + countTimingGroup(tg!, {
            from: options.from,
            to: options.to,
            density: aff.density,
            connects
        });
    }, 0);
}

export function countTimingGroup(tg: TimingGroup, options: CountTimingGroupOptions = {}) {
    if (tg.attributes.includes("noinput")) {
        return 0;
    }

    const {
        from = -Infinity,
        to = Infinity,
        density = 1
    } = options;

    // 获取区间内 Note 并按时间排序
    const notes = tg
        .filter((note) => ((note as Hold).timeEnd ?? note.time) >= from && note.time <= to)
        .sort((a, b) => a.time - b.time);

    // 合并用于判断是否相连的 Arc
    const resolvedConnects = [
        ...options.connects ?? [],
        ...notes.filter(Arc.is)
    ];

    // 获取所有 Timing
    const timings = tg.filter(Timing.is);
    if (!timings.length) {
        throw new Error(`Note with type "timinggroup" should at least have one "timing" note`);
    }

    // 建立起始时间与时间片的映射
    const chunks = timings.reduce((res, timing, i) => {
        const time = i > 0 ? timing.time : -Infinity;
        const chunk = (timing.bpm >= 255 ? 60000 : 30000) / timing.bpm / density;
        res.push([time, chunk]);
        return res;
    }, [] as [number, number][]);

    const createChunkGetter = () => {
        let idx = 0;
        return (time: number) => {
            while (time >= chunks[idx + 1]?.[0]) idx++;
            return chunks[idx][1];
        };
    };

    const counts = {
        tap: notes.filter(Tap.is).length,
        flick: notes.filter(Flick.is).length,
        hold: 0,
        arc: 0,
        arctap: 0
    };

    const getHoldChunk = createChunkGetter();
    counts.hold += notes
        .filter(Hold.is)
        .reduce((res, hold) => {
            const chunk = getHoldChunk(hold.time);
            return res + countHoldLike(hold, from, to, chunk, resolvedConnects);
        }, 0);

    const getArcChunk = createChunkGetter();
    counts.arc += notes
        .filter(Arc.is)
        .filter((arc) => !arc.skyline)
        .reduce((res, arc) => {
            const chunk = getArcChunk(arc.time);
            return res + countHoldLike(arc, from, to, chunk, resolvedConnects);
        }, 0);

    counts.arctap += tg
        .filter(Arc.is)
        .filter((arc) => arc.skyline)
        .reduce((res, arc) => {
            return res + arc.arctap.filter((time) => time >= from && time <= to).length;
        }, 0);

    return counts.tap + counts.flick + counts.hold + counts.arc + counts.arctap;
}

function countHoldLike(note: Hold | Arc, from: number, to: number, chunk: number, connects: Arc[]) {
    const { duration } = note;
    if (duration <= 0) {
        return 0;
    }

    // 持续时长小于 2 个时间片时，在第一个时间片头部计入 1 物量
    if (duration < 2 * chunk) {
        return from <= note.time ? 1 : 0;
    }

    // 是否为被首尾相连的 Arc Note
    const isConnected = Arc.is(note) && connects.some((n) => (
        Math.abs(n.timeEnd - note.time) <= 5
        && !n.skyline
        && n.y2 === note.y1
        && Math.abs(n.x2 - note.x1) <= 0.1
    ));

    // 收集判定点：第一个判定块是否计入物量取决于该 Note 是否被连接，最后一个判定块当且仅当等于时间片长度时计入物量
    const points: number[] = [];
    for (let i = isConnected ? 0 : chunk; i < duration; i += chunk) {
        if (duration - i >= chunk) {
            points.push(Math.floor(note.time + i));
        }
    }

    const left = points.findLastIndex((time) => time < from) + 1;
    const right = points.findIndex((time) => time > to);
    return (right === -1 ? points.length : right) - left;
}