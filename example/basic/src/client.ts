import type { EventDefs, MethodDefs } from "./api";
import { createRpcClient, createRpcEventsClient } from '../../../src'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

export const client = createRpcClient<MethodDefs>(ipcRenderer);

export const clientEvents = createRpcEventsClient<EventDefs>(ipcRenderer);

