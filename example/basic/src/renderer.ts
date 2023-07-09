// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron')

console.log(ipcRenderer)

ipcRenderer.invoke('foo', 'Hi').then(response => {
    console.log(response)
})