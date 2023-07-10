
export type AbstractMethodsDef = Record<string, (...args: any[]) => Promise<unknown> | unknown>

export type AbstractEventsDef = Record<string, {type: any}>

export type IpcEventSubscription = {
    unsubscribe(): void
}

export type ElectronIpcMainEvent = {
    processId: number
    frameId: number
}