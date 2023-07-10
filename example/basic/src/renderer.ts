// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.


import { client, rendererEventEmitter, mainEvents } from "./client";



client.foo("hi").then(response => {
    console.log(response)
})

client.bar("hi", 5).then(response => {
    console.log(response)
})


const subscription = mainEvents.update.subscribe((data) => console.log("Received from server:", data))
setTimeout(() => {
    console.log("Unsubscribe")
    subscription.unsubscribe()
}, 5000)


document.addEventListener('click', (click) => {
    rendererEventEmitter.click.emit({x: click.clientX, y: click.clientY})
})