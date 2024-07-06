import type { Aff, Note, TimingGroup } from "@zaffjs/core";
import type { AFFError } from "./types";
import { lexer } from "./lexer";
import { parser } from "./parser";
import { locationFromToken } from "./utils";
import { visitor } from "./visitor";

export const parseAff = createParser<Aff>("head", "aff");
export const parseNote = createParser<Note | TimingGroup>("body", "item");

function createParser<T>(lexerMode: "head" | "body", parserRule: "aff" | "item") {
    return function(input: string) {
        const errors: AFFError[] = [];
        const lexingResult = lexer.tokenize(input, lexerMode);

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
        const parsingResult = parser[parserRule]();

        errors.push(...parser.errors.map((e) => ({
            message: e.message,
            location: locationFromToken(e.token)
        })));

        const res = visitor.visit(parsingResult, errors) as T;

        if (errors.length > 0) {
            throw new Error(`[Line:${errors[0].location.startLine}] ${errors[0].message}`);
        }
        return res;
    };
}