import { createServerEventEmitter, rpcServerEvent } from "../../../src"

export const methods = {
    async foo (msg: string): Promise<string> { 
        return await msg + " from main" 
    },
    bar: (msg: string, opt?: number): string => msg + " from main bar " + opt ,
    ...{log: console.log, error: console.error}
}


export const events = {
    update: rpcServerEvent<string>()
}

export const rendererEvents = {
    click: rpcServerEvent<{x: number, y: number}>()
}

export type EventDefs = typeof events
export type MethodDefs = typeof methods
export type RendererEventDefs = typeof rendererEvents

/*
There are more ways the same method and event definitions can be exported
as illustrated below. 

One downside with defining the methods like above is that in order to access
things like specific browser windows, database connections, etc., you will
have to create essentially singletons that can be imported. 
If you want to avoid that, and instead use something like dependency injection,
you can do so and still export the types. 
*/

function setupService() {
    return {
        methods, events
    }
}

class Service {
    defineMethods() {
        return methods
    }

    doSomething() {
        this.events.update.broadcast("hello")
    }

    // This illustrates how the event emitter can be created 
    // while at the same time defining the types of events.
    // The event emitter type can be exported and used 
    // when creating the client as illustrated wiht EventDefs2 below.
    events = createServerEventEmitter(null, {
        update: rpcServerEvent<string>(),
    })
}


export type EventDefs2 = Service['events'] 
export type MethodDefs2 = ReturnType<typeof setupService>['methods']
export type MethodDefs3 = ReturnType<Service['defineMethods']>

