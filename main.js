const {app, BrowserWindow} = require('electron')
const localShortcut = require('electron-localshortcut')

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
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('info-channel', 'Fenster erzeugt')
  })
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
  regShortcuts()
})

function regShortcuts(){
  const saveShortcut = localShortcut.register(win, 'CommandOrControl+S', () => {
    win.webContents.send('shortcut-registration-save', 'save')
  })
  const openShortcut = localShortcut.register(win, 'CommandOrControl+O', () => {
    win.webContents.send('shortcut-registration-open', 'open')
  })
  const saveAsShortcut = localShortcut.register(win, 'CommandOrControl+Shift+S', () => {
    win.webContents.send('shortcut-registration-saveAs', 'saveAs')
  })
  if(!saveShortcut) win.webContents.send('info-channel',{msg: 'Registrierung des Save Shortcuts fehlgeschlagen'})
  if(!openShortcut) win.webContents.send('info-channel',{msg: 'Registrierung des Open Shortcuts fehlgeschlagen'})
  if(!saveAsShortcut) win.webContents.send('info-channel',{msg: 'Registrierung des SaveAs Shortcuts fehlgeschlagen'})
}

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
