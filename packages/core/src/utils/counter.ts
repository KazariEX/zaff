import { Arc, Flick, Hold, Tap, Timing, type TimingGroup } from "../note";
import type { Aff } from "../aff";

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
    const tgs = [...aff];

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

    // 获取范围内 Note 并按时间排序
    const notes = tg
        .filter((note) => note.time >= from && note.time <= to)
        .sort((a, b) => a.time - b.time);

    // 合并用于判断是否相连的 Arc
    const resolvedConnects = [
        ...options.connects ?? [],
        ...notes.filter(Arc.is)
    ];

    const timings = notes.filter(Timing.is);
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

    const counts = {
        tap: notes.filter(Tap.is).length,
        flick: notes.filter(Flick.is).length,
        hold: 0,
        arc: 0,
        arctap: 0
    };

    let holdChunkIdx = 0;
    counts.hold += notes
        .filter(Hold.is)
        .reduce((res, hold) => {
            const { duration } = hold;
            if (duration <= 0) {
                return res;
            }

            // 获取当前时间片
            while (hold.time > chunks[holdChunkIdx + 1]?.[0]) {
                holdChunkIdx++;
            }
            const [, chunk] = chunks[holdChunkIdx];

            // 持续时长小于时间片时，Hold 被对半分为两个判定块，仅第一块计入物量
            if (duration < chunk) {
                return res + 1;
            }

            // 按照时间片对 Hold 切分为一个个判定块，最后一个判定块不计入物量
            const piece = Math.floor(duration / chunk);

            // 范围结束时间小于 Hold 结束时间时，所截取的判定块数目向上取整
            const cuttedPiece = Math.ceil((to - hold.time) / chunk);

            // 两者较小值即为有效物量
            return res + Math.min(piece, cuttedPiece);
        }, 0);

    let arcChunkIdx = 0;
    counts.arc += notes
        .filter(Arc.is)
        .reduce((res, arc) => {
            const { duration, skyline } = arc;
            if (duration <= 0) {
                return res;
            }

            // Arc 为黑线时，仅计入其 ArcTap 的物量
            if (skyline) {
                counts.arctap += arc.arctap.filter((time) => time >= from && time <= to).length;
                return res;
            }

            // 获取当前时间片
            while (arc.time > chunks[arcChunkIdx + 1]?.[0]) {
                arcChunkIdx++;
            }
            const [, chunk] = chunks[arcChunkIdx];

            // 持续时长小于时间片时，Arc 被对半分为两个判定块，仅第一块计入物量
            if (duration < chunk) {
                return res + 1;
            }

            // 是否存在与其首尾相连的 Arc
            const isConnected = !!resolvedConnects.find((note) => (
                !note.skyline
                && note.y2 === arc.y1
                && Math.abs(note.x2 - arc.x1) <= 0.1
                && Math.abs(note.timeEnd - arc.time) <= 5
            ));

            // 按照时间片对 Arc 切分为一个个判定块，最后一个判定块是否计入物量取决于该 Arc 是否被连接
            const piece = Math[isConnected ? "ceil" : "floor"](duration / chunk);

            // 范围结束时间小于 Arc 结束时间时，所截取的判定块数目向上取整
            const cuttedPiece = Math.ceil((to - arc.time) / chunk);

            // 两者较小值即为有效物量
            return res + Math.min(piece, cuttedPiece);
        }, 0);

    return counts.tap + counts.flick + counts.hold + counts.arc + counts.arctap;
}