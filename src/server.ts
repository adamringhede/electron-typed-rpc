import { AbstractEventsDef, AbstractMethodsDef } from "./common"

type ElectronIpcMainInvokeEvent = {

}

type ElectronIpcMain = {
    handle: (
        channel: string, 
        listener: (event: ElectronIpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown
    ) => void
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
    // for each key in events, 
    // Maybe I should just have the method already being called do this stuff. 
    // The only downside with that is that is that I would need access to the BrowserWindow which I don't want to
    // Better to sent it here
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