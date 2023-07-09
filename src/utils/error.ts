class AffParserError extends Error
{
    content: string;
    line: number;

    constructor(content: string = "", line: number = -1)
    {
        super();
        this.content = content;
        this.line = line + 1;
    }

    get message()
    {
        return `invalid format of line(${this.line}): "${this.content}"`;
    }
}

export {
    AffParserError
};