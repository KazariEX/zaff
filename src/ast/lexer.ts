import { createToken, Lexer } from "chevrotain";

const value = createToken({ name: "value", pattern: Lexer.NA });
const float = createToken({ name: "float", pattern: /-?\d+\.\d+/, categories: value });
const int = createToken({ name: "int", pattern: /-?(?:0|[1-9]\d*)/, categories: value });
const word = createToken({ name: "word", pattern: /[a-zA-Z_]\w*/, categories: value });

const colon = createToken({ name: "colon", pattern: /:/, label: ":" });
const comma = createToken({ name: "comma", pattern: /,/, label: "," });
const semi = createToken({ name: "semi", pattern: /;/, label: ";" });
const lBrace = createToken({ name: "left-brace", pattern: /\{/, label: "{" });
const rBrace = createToken({ name: "right-brace", pattern: /\}/, label: "}" });
const lBrack = createToken({ name: "left-brack", pattern: /\[/, label: "[" });
const rBrack = createToken({ name: "right-brack", pattern: /\]/, label: "]" });
const lParen = createToken({ name: "left-paren", pattern: /\(/, label: "(" });
const rParen = createToken({ name: "right-paren", pattern: /\)/, label: ")" });

const dash = createToken({ name: "dash", pattern: /-(?:\r\n|\r|\n)/, label: "-", line_breaks: true, push_mode: "body" });
const endline = createToken({ name: "endline", pattern: /\r\n|\r|\n/, line_breaks: true });
const whitespace = createToken({ name: "whitespace", pattern: /\s+/, group: Lexer.SKIPPED });

export const tokenTypes = {
    value, float, int, word, colon, comma, dash, semi, lBrace, rBrace, lBrack, rBrack, lParen, rParen, endline, whitespace
};

export const lexer = new Lexer({
    modes: {
        head: [float, int, word, colon, dash, endline, whitespace],
        body: [float, int, word, comma, semi, lBrace, rBrace, lBrack, rBrack, lParen, rParen, whitespace]
    },
    defaultMode: "head"
});