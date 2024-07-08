import type { Aff, NoteKind, TimingGroup } from "@zaffjs/core";

export type SortMode = "time" | "kind";

interface BaseSortOptions {
    mode?: SortMode;
    kinds?: Exclude<NoteKind, "arctap" | "timinggroup">[];
    desc?: boolean;
}

export interface SortAffOptions extends BaseSortOptions {}

export interface SortTimingGroupOptions extends BaseSortOptions {}

export function sortAff(aff: Aff, options: SortAffOptions = {}) {
    for (const tg of aff) {
        sortTimingGroup(tg, options);
    }
}

export function sortTimingGroup(tg: TimingGroup, options: SortTimingGroupOptions = {}) {
    const {
        mode = "time",
        kinds = ["timing", "tap", "flick", "hold", "arc", "camera", "scenecontrol"] as NoteKind[],
        desc = false
    } = options;

    switch (mode) {
        case "kind": {
            tg.sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.time - b.time);
            break;
        }
        case "time": {
            tg.sort((a, b) => a.time - b.time || kinds.indexOf(a.kind) - kinds.indexOf(b.kind));
            break;
        }
    }
    desc && tg.reverse();
}