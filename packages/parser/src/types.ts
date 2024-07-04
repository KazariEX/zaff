import type { CstNode, CstNodeLocation, IToken } from "chevrotain";

export interface AFFError {
    message: string;
    location: CstNodeLocation;
}

export type ResolveCstNodes<T extends string> = {
    [K in T]: CstNode[];
};

export type ResolveITokens<T extends string> = {
    [K in T]: IToken[];
};