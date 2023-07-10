import { AbstractEventsDef, AbstractMethodsDef, ElectronIpcMainEvent, IpcEventSubscription } from "./common";

type ElectronIpcRenderer = {
    invoke(channel: string, ...args: unknown[]): Promise<unknown> 
    send(channel: string, ...args: unknown[]): void 
    on(channel: string, listener: (event: ElectronIpcMainEvent, ...args: unknown[]) => unknown): void
    removeListener(channel: string, listener: (event: ElectronIpcMainEvent, ...args: unknown[]) => unknown): void
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


export function createRendererEventEmitter<T extends AbstractEventsDef>(ipcRenderer: ElectronIpcRenderer) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                emit(...args: unknown[]) {
                    ipcRenderer.send(key, ...args)
                }
            }
        }
    }) as {[Property in keyof T]: {
        emit: (data: T[Property]['type']) => void
    }}
}

type SelectPropertyTypes<T, P> = Pick<T, {[K in keyof T]: T[K] extends P ? K : never}[keyof T]>
type OnlyEvents<T> = SelectPropertyTypes<T, {type: any}>

type AbstractEventEmitterEvents = Record<string, { broadcast(...args: any): void }>

export function createMainEventsReceiver<T extends AbstractEventsDef | AbstractEventEmitterEvents | Record<string, any>>(ipcRenderer: ElectronIpcRenderer) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                subscribe(callback: (data: unknown) => unknown) {
                    const listener = (event: ElectronIpcMainEvent, data: unknown) => callback(data)
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
