
export type AbstractMethodsDef = Record<string, (...args: any[]) => Promise<unknown> | unknown>

export type AbstractEventsDef = Record<string, {type: any}>
