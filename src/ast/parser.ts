import { CstParser } from "chevrotain";
import { tokenTypes } from "./lexer";

class Parser extends CstParser {
    constructor() {
        super(tokenTypes, { recoveryEnabled: true, nodeLocationTracking: "full" });
        this.performSelfAnalysis();
    }

    aff = this.RULE("aff", () => {
        this.SUBRULE(this.head);
        this.SUBRULE(this.body);
    });

    head = this.RULE("head", () => {
        this.MANY(() => this.SUBRULE(this.meta));
        this.CONSUME(tokenTypes.dash);
    });

    meta = this.RULE("meta", () => {
        this.CONSUME(tokenTypes.word);
        this.CONSUME(tokenTypes.colon);
        this.CONSUME(tokenTypes.value);
        this.CONSUME(tokenTypes.endline);
    });

    body = this.RULE("body", () => {
        this.MANY(() => this.SUBRULE(this.item));
    });

    item = this.RULE("item", () => {
        this.SUBRULE(this.note);
        this.CONSUME(tokenTypes.semi);
    });

    note = this.RULE("note", () => {
        this.OPTION(() => this.CONSUME(tokenTypes.word));
        this.SUBRULE(this.params);
        this.OPTION1(() => this.SUBRULE(this.connects));
        this.OPTION2(() => this.SUBRULE(this.children));
    });

    params = this.RULE("params", () => {
        this.CONSUME(tokenTypes.lParen);
        this.MANY_SEP({
            SEP: tokenTypes.comma,
            DEF: () => this.CONSUME(tokenTypes.value)
        });
        this.CONSUME(tokenTypes.rParen);
    });

    connects = this.RULE("connects", () => {
        this.CONSUME(tokenTypes.lBrack);
        this.MANY_SEP({
            SEP: tokenTypes.comma,
            DEF: () => this.SUBRULE(this.note)
        }),
        this.CONSUME(tokenTypes.rBrack);
    });

    children = this.RULE("children", () => {
        this.CONSUME(tokenTypes.lBrace);
        this.SUBRULE(this.body);
        this.CONSUME(tokenTypes.rBrace);
    });
}

export const parser = new Parser();
export const BaseVisitor = parser.getBaseCstVisitorConstructorWithDefaults();