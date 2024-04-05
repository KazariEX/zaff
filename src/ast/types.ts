import type { CstNodeLocation } from "chevrotain";

export interface AFFError {
    message: string,
    location: CstNodeLocation
}