import { AbstractMethodsDef } from "./common";

type ElectronIpcRenderer = {
    invoke(key: string, ...args: unknown[]): Promise<unknown> 
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
