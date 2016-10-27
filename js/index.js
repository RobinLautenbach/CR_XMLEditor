'use strict';

const {ipcRenderer, remote} = require('electron')
let filePath = ""
let fileName = ""
let dialog = remote.dialog
let xml2js = require('xml2js')
let fs = require('fs')
let $ = require('jQuery');


let fileOpenButton = document.getElementById('fileOpenButton')
let fileSaveButton = document.getElementById('fileSaveButton')

fileOpenButton.addEventListener('click', () => {
  openFile()
})

fileSaveButton.addEventListener('click', () => {
  saveFile()
})

ipcRenderer.on('shortcut-registration-open', (event, arg) => {
    openFile()
})

ipcRenderer.on('shortcut-registration-save', (event, arg) => {
    saveFile()
})

ipcRenderer.on('info-channel', (event, data) => {
  console.log(data)
})

function saveFile(){
  console.log("Speichere Datei")
  let content = editor.getValue()
  console.log(content)
  if(filePath != ""){
    fs.writeFile(filePath, content, function(err){
      if(err){
        console.log("Fehler beim Speichern der Datei!")
      }
    })
  }
}

function openFile(){
    dialog.showOpenDialog({title: 'Datei öffnen', properties: ['openFile'], filters: [{name: 'XML', extensions: ['xml', 'XML']}]}, (file) => {
        //Datei einlesen
        try{
          filePath = file[0]
          readFile(file[0])
        }catch(e){
          console.log("Keine Datei ausgewählt")
        }
        fileName = filePath.replace(/^.*(\\|\/|\:)/, '')
        $('.title').append(' (' + fileName + ')')
    })
}

function readFile(path){
  fs.readFile(path, 'utf8', function (err, data) {
    if(err){
      console.log("Fehler beim Lesen der Datei")
    }else{
      console.log(data)
      editor.setValue(data)
    }
    // XML-String in JSON umwandeln
    //parse2JSON(data)
  })
}

function parse2JSON(file){
  let parser = new xml2js.Parser()
  parser.parseString(file, function (err, result) {
      if (err) {
           return "Fehler beim Parsen"
      }else {
        // result beinhaltet das JSON-Objekt
          return result
      }
  })
}
