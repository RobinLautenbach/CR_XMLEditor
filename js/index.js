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
let fileSaveAsButton = document.getElementById('fileSaveAsButton')
let c = null
let editor = null
let starSet = false

fileOpenButton.addEventListener('click', () => {
  openFile()
})

fileSaveButton.addEventListener('click', () => {
  saveFile()
})

fileSaveAsButton.addEventListener('click', () => {
  saveFileAs()
})

ipcRenderer.on('shortcut-registration-open', (event, arg) => {
    openFile()
})

ipcRenderer.on('shortcut-registration-save', (event, arg) => {
    saveFile()
})

ipcRenderer.on('shortcut-registration-saveAs', (event, arg) => {
    saveFileAs()
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

function saveFileAs(){
  console.log('Speichern unter')
  let content = editor.getValue()
  dialog.showSaveDialog({title: 'Speichern unter', filters: [{name: 'XML', extensions: ['xml']}]}, (fileName) => {
         if (fileName === undefined){
              console.log("Kein Dateiname angegeben");
              return;
         }
         // fileName is a string that contains the path and filename created in the save file dialog.
         fs.writeFile(fileName, content, function (err) {
             if(err){
                 console.log("Fehler beim Schreiben der Datei: "+ err.message)
             }

             console.log("Die Datei wurde erfolgreich gespeichert")
         })
  })
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
        $('.title').text('XML-Editor')
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
      initializeEditor(data)
    }
    // XML-String in JSON umwandeln
    //parse2JSON(data)
  })
}

function initializeEditor(data){
    if(editor != null){
      editor = null
      c = null
      let ediv = document.getElementById('editorDiv')
      while(ediv.firstChild){
        ediv.removeChild(ediv.firstChild)
      }
    }
    let tArea = document.createElement('Textarea')
    tArea.id = 'textarea1'
    tArea.classList.add('form-control')
    tArea.classList.add('editor-textfield')
    document.getElementById('editorDiv').appendChild(tArea)
    editor = CodeMirror.fromTextArea(document.getElementById("textarea1"), {
    lineNumbers: true,
    mode: "xml",
    extraKeys: {
      "'<'": completeAfter,
      "'/'": completeIfAfterLt,
      "' '": completeIfInTag,
      "'='": completeIfInTag,
      "Ctrl-Space": "autocomplete"
    },
    hintOptions: {schemaInfo: tags}
  })

    editor.setValue(data)
    c = editor.changeGeneration()
    starSet = false
    editor.on('change', (instance, change) => {
      if(!editor.isClean(c) && !starSet){
        $('.title').append('*')
        starSet = true
      }else if(editor.isClean(c)){
        $('.title').text('XML-Editor (' + fileName + ')')
        starSet = false
      }
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
