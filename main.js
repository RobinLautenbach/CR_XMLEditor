const {app, BrowserWindow, ipcMain, globalShortcut, dialog} = require('electron')
let xml2js = require('xml2js')
let  fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1024, height: 768})
  win.setMenu(null);
  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  const saveShortcut = globalShortcut.register('CommanOrControl+S', () => {})
  const openShortcut = globalShortcut.register('CommanOrControl+O', () => {
    openFile()
  })
  win.webContents.send('info-channel', {msg: 'Test 123'})
  if(!saveShortcut) win.webContents.send('info-channel',{msg: 'Registrierung des Save Shortcuts fehlgeschlagen'})
  if(!openShortcut) win.webContents.send('info-channel',{msg: 'Registrierung des Open Shortcuts fehlgeschlagen'})

})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-file', (event, arg) => {
  let file = dialog.showOpenDialog({title: 'Datei öffnen', properties: ['openFile'], filters: [{name: 'XML', extensions: ['xml', 'XML']}]})
  let parser = new xml2js.Parser()
  // Datei einlesen
  try {
    fs.readFile(file[0], function (err, data) {
      // XML-String in JSON umwandeln
      parser.parseString(data, function (err, result) {
          if (err) {
               event.returnValue = "Fehler beim Parsen"
          }else {
            // result beinhaltet das JSON-Objekt
              event.returnValue = result
          }
      })
    })
  } catch (e) {
    event.returnValue = "Fehler beim Lesen der Datei"
  }
})

ipcMain.on('save-file', (event, arg) => {
  event.returnValue = saveFile()
})

function saveFile(){
  return "Datei gespeichert"
}

function openFile(){
  let file = dialog.showOpenDialog({title: 'Datei öffnen', properties: ['openFile'], filters: [{name: 'XML', extensions: ['xml', 'XML']}]})
  let parser = new xml2js.Parser()
  // Datei einlesen
  try {
    fs.readFile(file[0], function (err, data) {
      // XML-String in JSON umwandeln
      parser.parseString(data, function (err, result) {
          if (err) {
               return "Fehler beim Parsen"
          }else {
            // result beinhaltet das JSON-Objekt
              return result
          }
      })
    })
  } catch (e) {
    return "Fehler beim Lesen der Datei"
  }
}
