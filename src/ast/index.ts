import type { Aff } from "../aff";
import type { AFFError } from "./types";
import { lexer } from "./lexer";
import { parser } from "./parser";
import { locationFromToken } from "./utils";
import { visitor } from "./visitor";

export function text2Aff(text: string): Aff {
    const errors: AFFError[] = [];
    const lexingResult = lexer.tokenize(text);

    errors.push(...lexingResult.errors.map((e) => ({
        message: e.message,
        location: {
            startOffset: e.offset,
            endOffset: e.offset + e.length,
            startLine: e.line,
            endLine: e.line,
            startColumn: e.column,
            endColumn: e.column! + e.length
        }
    })));

    parser.input = lexingResult.tokens;
    const parsingResult = parser.aff();

    errors.push(...parser.errors.map((e) => ({
        message: e.message,
        location: locationFromToken(e.token)
    })));

    const aff = visitor.visit(parsingResult, errors);

    if (errors.length > 0) {
        throw new Error(`[Line:${errors[0].location.startLine}] ${errors[0].message}`);
    }
    return aff;
}