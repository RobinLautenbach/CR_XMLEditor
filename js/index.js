'use strict';

const {ipcRenderer} = require('electron')
var fileOpenButton = document.getElementById('fileOpenButton')

fileOpenButton.addEventListener('click', function(){
  console.log(ipcRenderer.sendSync('open-file', 'Öffne Datei'))
})

ipcRenderer.on('open-file', (event, arg) => {
  console.log(event.returnValue)
})
