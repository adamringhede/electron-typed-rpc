import type { MethodDefs } from "./api";
import { createRpcClient } from '../../../src'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

export const client = createRpcClient<MethodDefs>(ipcRenderer);

