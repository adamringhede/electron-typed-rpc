// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.


import { client, clientEvents } from "./client";



client.foo("hi").then(response => {
    console.log(response)
})

client.bar("hi", 5).then(response => {
    console.log(response)
})

clientEvents.update.subscribe((data) => console.log("Received from server:", data))
