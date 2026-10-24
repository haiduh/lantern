import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs/promises'

type Machine = {
  id: string
  name: string
  ip: string
  port: number
}

const machinePath = path.join(app.getPath('userData'), 'machines-save', 'machines.json')
const dirPath = path.dirname(machinePath)

async function handleStats(ip: string, port: number) {
  try {
    const response = await fetch(`http://${ip}:${port}/stats`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    throw error
  }
}

async function readMachines() {
  try {
    console.log(machinePath)
    const data = await fs.readFile(machinePath, 'utf-8')
    const parsedData = JSON.parse(data)
    console.log('This is the data: ', parsedData)
    return parsedData
  } catch (err) {
    console.error('Error reading file:', err)
    return []
  }
}

async function writeMachines(machines: Machine[]) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
    console.log(machinePath)
    await fs.writeFile(machinePath, JSON.stringify(machines, null, 2), 'utf-8')
    console.log('File written successfully!')
  } catch (err) {
    console.error('Error writing file:', err)
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    title: 'Lantern',
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  ipcMain.handle('get-stats', (_, ip, port) => handleStats(ip, port))
  ipcMain.handle('get-machines', readMachines)
  ipcMain.handle('save-machines', (_, machines) => writeMachines(machines))
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
