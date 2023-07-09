
// TODO Make it possible to not have to define all of them as async and return a promise if they don't need to

export const methods = {
    async foo (msg: string): Promise<string> { return msg + " from main" }
}


export type MethodDefs = typeof methods