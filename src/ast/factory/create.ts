import type { IToken } from "chevrotain";
import type { Note, TimingGroup } from "../../note";
import { locationFromToken } from "../utils";
import type { AFFError, ResolveCstNodes } from "../types";

type Factory = Record<string, (
    errors: AFFError[],
    ctx: ResolveCstNodes<"children" | "connects" | "params">,
    params: IToken[],
    connects: Note[],
    children: Note[]
) => Note | TimingGroup | null>;

type FactoryOptions = Record<string, {
    paramsCount: number;
    connectKinds?: string[];
    hasChildren?: boolean;
    fieldTypes: Record<string, string[]>;
    return: (options: any, connects?: Note[], children?: Note[]) => Note | TimingGroup;
}>;

export function createFactory(options: FactoryOptions) {
    const factory: Factory = {};

    for (const [kind, setting] of Object.entries(options)) {
        factory[kind] = (errors, ctx, params, connects, children) => {
            if (
                !checkParamsCount(errors, kind, ctx, params, setting.paramsCount) ||
                !checkConnects(errors, kind, ctx, connects, setting.connectKinds ?? []) ||
                !checkChildren(errors, kind, ctx, children, setting.hasChildren)
            ) {
                return null;
            }
            const options = detectParams(errors, kind, params, setting.fieldTypes);
            return options && setting.return(options, connects, children);
        };
    }

    return factory;
}

// 检测参数数量
function checkParamsCount(errors: AFFError[], kind: string, ctx: ResolveCstNodes<"params">, params: IToken[], count: number) {
    return (count !== void (0) && params.length !== count) ? (
        errors.push({
            message: `Note with type "${kind}" should have ${count} field(s) instead of ${params.length} field(s)`,
            location: ctx.params[0].location!
        }), false
    ) : true;
}

// 检测连携物件
function checkConnects(errors: AFFError[], kind: string, ctx: ResolveCstNodes<"connects">, connects: Note[], connectKinds: string[]) {
    if (connects) {
        if (connectKinds.length === 0) {
            errors.push({
                message: `Note with type "${kind}" should not have connected note(s)`,
                location: ctx.connects[0].location!
            });
            return false;
        }
        return connects.every((note) => ((!connectKinds.includes(note.kind)) ? (
            errors.push({
                message: `Note with type "${kind}" should note have connected note with type "${note.kind}"`,
                location: ctx.connects[0].location!
            }), false
        ) : true));
    }
    else return true;
}

// 检测子物件
function checkChildren(errors: AFFError[], kind: string, ctx: ResolveCstNodes<"children">, children: Note[], hasChildren = false) {
    return (!hasChildren && children) ? (
        errors.push({
            message: `Note with type "${kind}" should not have child note(s)`,
            location: ctx.children[0].location!
        }), false
    ) : true;
}

// 处理参数
function detectParams(errors: AFFError[], kind: string, params: IToken[], fieldTypes: Record<string, string[]>) {
    const options: Record<string, any> = {};
    const entries = Object.entries(fieldTypes);
    for (let i = 0; i < entries.length; i++) {
        const [field, typeNames] = entries[i];
        const param = params[i];

        const tokenType = param.tokenType;
        if (typeNames.includes(tokenType.name)) {
            options[field] = transforParamValue(tokenType.name, param.image);
        }
        else {
            errors.push({
                message: `The param in the "${field}" field of note with type "${kind}" should be "${typeNames}" instead of "${param.tokenType.name}"`,
                location: locationFromToken(param)
            });
            return null;
        }
    }
    return options;
}

// 参数类型转换
function transforParamValue(type: string, value: string) {
    switch (type) {
        case "int": return Number.parseInt(value);
        case "float": return Number.parseFloat(value);
        default: return value;
    }
}