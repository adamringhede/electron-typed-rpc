import { AbstractEventsDef, AbstractMethodsDef, ElectronIpcMainEvent, IpcEventSubscription } from "./common"

type ElectronIpcMainInvokeEvent = {

}

type ElectronIpcMain = {
    handle: (
        channel: string, 
        listener: (event: ElectronIpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown
    ) => void
    on(channel: string, listener: (event: ElectronIpcMainEvent, ...args: unknown[]) => unknown): void
    removeListener(channel: string, listener: (event: ElectronIpcMainEvent, ...args: unknown[]) => unknown): void
}


export function registerRpcServer<T extends AbstractMethodsDef>(ipcMain: ElectronIpcMain, methods: T) {
    Object.entries(methods).forEach(([name, fn]) => {
        ipcMain.handle(name, (event, ...args: unknown[]) => {
            return fn(...args)
        })
    })
}

export function rpcServerEvent<T>(): {type: T} { return {type: null as T} }

type BrowserWindow = {
    webContents: {
        send(channel: string, ...args: any[]): void;
    }
}

type BrowserWindowClass = {
    new(...args: any[]): BrowserWindow;
    getAllWindows(): BrowserWindow[]
}

export function createServerEventEmitter<T extends AbstractEventsDef>(BrowserWindow: BrowserWindowClass, events: T) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                broadcast(...args: unknown[]) {
                    BrowserWindow.getAllWindows().forEach(win => {
                        win.webContents.send(key, ...args)
                    })
                }
            }
        }
    }) as {[Property in keyof T]: {
        broadcast: (data: T[Property]['type']) => void
    }}
}


export function createRendererEventsServer<T extends AbstractEventsDef>(ipcMain: ElectronIpcMain) {
    return new Proxy({}, {
        get(target, key: string) {
            return {
                subscribe(callback: (data: unknown) => unknown) {
                    const listener = (event: unknown, data: unknown) => callback(data)
                    ipcMain.on(key, listener)
                    return {
                        unsubscribe() {
                            ipcMain.removeListener(key, listener)
                        }
                    }
                }
            }
        }
    }) as {[Property in keyof T]: {
        subscribe: (callback: (data: T[Property]['type']) => void) => IpcEventSubscription
    }}
}