import type { ScopeType } from "../../index";

export function bare(value: TemplateStringsArray) {
    return { type: "Bare" as ScopeType, value: value[0] }
}
export function square(value: TemplateStringsArray) {
    return { type: "Square" as ScopeType, value: value[0] }
}
export function curly(value: TemplateStringsArray) {
    return { type: "Curly" as ScopeType, value: value[0] }
}
