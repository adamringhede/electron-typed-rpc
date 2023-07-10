import { AbstractEventsDef, AbstractMethodsDef } from "./common";

type ElectronIpcRenderer = {
    invoke(key: string, ...args: unknown[]): Promise<unknown> 
    on(key: string, data: unknown): void
}

type Promisify<T extends AbstractMethodsDef> = {
    [Property in keyof T]: ReturnType<T[Property]> extends Promise<any> 
        ? T[Property] 
        : (...args: Parameters<T[Property]>) => Promise<ReturnType<T[Property]>>
}

export function createRpcClient<T extends AbstractMethodsDef>(ipcRenderer: ElectronIpcRenderer) {
    const dummyTarget = {};
    const proxyClient = new Proxy(dummyTarget, {
        get(target: typeof dummyTarget, key: string) {
            return (...args: unknown[]) => {
                return ipcRenderer.invoke(key, ...args)
            }
        }
    })
    return proxyClient as Promisify<T>
}

export function createRpcEventsClient<T extends AbstractEventsDef>(ipcRenderer: ElectronIpcRenderer) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                subscribe(callback: (data: unknown) => unknown) {
                    ipcRenderer.on(key, (event: unknown, data: unknown) => callback(data))
                }
            }
        }
    }) as {[Property in keyof T]: {
        subscribe: (callback: (data: T[Property]['type']) => void) => void
    }}
}
