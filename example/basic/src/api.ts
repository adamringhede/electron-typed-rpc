import { rpcServerEvent } from "../../../src"

export const methods = {
    async foo (msg: string): Promise<string> { 
        return await msg + " from main" 
    },
    bar: (msg: string, opt?: number): string => msg + " from main bar " + opt 
}


export const events = {
    update: rpcServerEvent<string>()
}

export type EventDefs = typeof events

export type MethodDefs = typeof methods