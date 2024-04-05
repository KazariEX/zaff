import type { CstNodeLocation, IToken } from "chevrotain";

// 从 Token 生成位置对象
export function locationFromToken(token: IToken): CstNodeLocation {
    const { startOffset, endOffset, startLine, endLine, startColumn, endColumn } = token;
    return { startOffset, endOffset, startLine, endLine, startColumn, endColumn };
}