# Electron Typed RPC

Make RPC calls between the renderer and main pracess simpler by having typing. 
This also enables for safe and easy refactoring

## Install

```
npm install electron-typed-rpc
```

## Usage

### Server

Start by defining your methods in a file. Ideally a separate file from your main processes entry point
because we are going to import types from this file in the client later. 

#### api.ts
```ts
export const methods = {
    foo(someData: string): string { return "hi from server. received " + someData }
}

export type MethodDefs = typeof methods 
```


#### main.ts
```ts
import { registerRpcServer } from 'electron-typed-rpc'
import { ipcMain } from 'electron'
import { methods } from './api'

registerRpcServer(ipcMain, methods)
```
The call to `registerRpcServer` will setup 'handle' callbacks and
call the methods you have defined. 

### Client

First create a file where you create your rpc client.
The reason for doing this is so that it can be imported in various
places in your application and be easily reused.

#### client.ts
```ts
import type { MethodDefs } from './api'
import { createRpcClient } from 'electron-typed-rpc'
const { ipcRenderer } = require('electron')

export const client = createRpcClient<MethodDefs>(ipcRenderer);
```

Note that for `require` to work, you need to add these to settings 
to your webPreferences when launching the Electron window.

```
nodeIntegration: true,
contextIsolation: false
```

#### Using it in your client 
Now that you have created your client, you can import it anywhere
in your code and invoke methods. Note that all your methods
will now return a promise, even if they were not declared in the 
server implementation.

```ts
import { client } from './client'

client.foo().then(response => console.log(response))
```