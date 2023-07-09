import { AbstractMethodsDef } from "./common"

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
        ipcMain.handle(name, (event, arg) => {
            return fn(arg)
        })
    })
}
