import type { MethodDefs } from "./api";


type ElectronIpcRenderer = {
    invoke(key: string, ...args: unknown[]): Promise<unknown> 
}

function createClient<T>(ipcRenderer: ElectronIpcRenderer): T {
    const dummyTarget = {};
    const proxyClient = new Proxy(dummyTarget, {
        get(target: typeof dummyTarget, key: string) {
            return (...args: unknown[]) => {
                // When called, send the args to ipcRenderer
                return ipcRenderer.invoke(key, ...args)
            }
        }
    })
    return proxyClient as T
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

export const client = createClient<MethodDefs>(ipcRenderer);

