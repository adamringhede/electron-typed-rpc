import type { EventDefs, MethodDefs, RendererEventDefs } from "./api";
import { createRpcClient, createRendererEventEmitter, createMainEventsReceiver } from '../../../src'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

export const client = createRpcClient<MethodDefs>(ipcRenderer);

export const mainEvents = createMainEventsReceiver<EventDefs>(ipcRenderer);

export const rendererEventEmitter = createRendererEventEmitter<RendererEventDefs>(ipcRenderer)