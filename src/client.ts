import { AbstractEventsDef, AbstractMethodsDef } from "./common";

type ElectronIpcRenderer = {
    invoke(key: string, ...args: unknown[]): Promise<unknown> 
    on(key: string, data: unknown): void
    removeListener(channel: string, listener: (...args: unknown[]) => unknown): void
}

type Promisify<T extends AbstractMethodsDef> = {
    [Property in keyof T]: ReturnType<T[Property]> extends Promise<any> 
        ? T[Property] 
        : (...args: Parameters<T[Property]>) => Promise<ReturnType<T[Property]>>
}

export function createRpcClient<T extends AbstractMethodsDef>(ipcRenderer: ElectronIpcRenderer) {
    return new Proxy({}, {
        get(target: {}, key: string) {
            return (...args: unknown[]) => {
                return ipcRenderer.invoke(key, ...args)
            }
        }
    }) as Promisify<T>
}

type SelectPropertyTypes<T, P> = Pick<T, {[K in keyof T]: T[K] extends P ? K : never}[keyof T]>
type OnlyEvents<T> = SelectPropertyTypes<T, {type: any}>
type IpcEventSubscription = {
    unsubscribe(): void
}

type AbstractEventEmitterEvents = Record<string, {broadcast(...args: any)}>

export function createRpcEventsClient<T extends AbstractEventsDef | AbstractEventEmitterEvents | Record<string, any>>(ipcRenderer: ElectronIpcRenderer) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                subscribe(callback: (data: unknown) => unknown) {
                    const listener = (event: unknown, data: unknown) => callback(data)
                    ipcRenderer.on(key, listener)
                    return {
                        unsubscribe() {
                            ipcRenderer.removeListener(key, listener)
                        }
                    }
                }
            }
        }
    }) as {[Property in keyof T]: {
        subscribe: (callback: (data: T[Property]['type']) => void) => IpcEventSubscription
    }}
}
