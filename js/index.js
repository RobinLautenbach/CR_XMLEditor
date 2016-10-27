'use strict';

const {ipcRenderer} = require('electron')
let fileOpenButton = document.getElementById('fileOpenButton')
let fileSaveButton = document.getElementById('fileSaveButton')

fileOpenButton.addEventListener('click', () => {
  console.log(ipcRenderer.sendSync('open-file', 'Öffne Datei'))
})

fileSaveButton.addEventListener('click', () => {
  console.log(ipcRenderer.sendSync('save-file', 'Speichere Datei'))
})

ipcRenderer.on('open-file', (event, arg) => {
  console.log(event.returnValue)
})

ipcRenderer.on('save-file', (event, arg) => {
  console.log(event.returnValue)
})

ipcRenderer.on('info-channel', (event, data) => {
  console.log(data.msg);
})
