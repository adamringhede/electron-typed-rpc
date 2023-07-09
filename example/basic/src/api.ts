
export const methods = {
    async foo (msg: string): Promise<string> { 
        return await msg + " from main" 
    },
    bar: (msg: string): string => msg + " from main bar"
}


export type MethodDefs = typeof methods