import { release } from 'node:os'
import * as process from 'node:process'
import { dirname, join } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, Menu, Tray, app, ipcMain, nativeImage, screen, shell } from 'electron'
import { useRecordWindow } from './windows/useRecordWindow'
import { useScreenshotWindow } from './windows/useScreenshotWindow'

import { shim } from './utils/platform'
import { protocolHandle } from './utils/protocol'
import { useRecord } from './useRecord'
import { useScreenshot } from './useScreenshot'
import { useImage } from './useImage'
import { useCamera } from './useCamera'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
    app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
    app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
let tray: Tray | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

function getSize() {
    const { size, scaleFactor } = screen.getPrimaryDisplay()
    return [size.width * scaleFactor, size.height * scaleFactor]
}

async function createWindow() {
    // 协议处理
    protocolHandle()

    // 主页面window创建
    const [width, height] = getSize()
    win = new BrowserWindow({
        width: 340,
        height: 42,
        // x: width - 240,
        // y: 100,
        title: 'User Recorder',
        alwaysOnTop: true,
        show: true,
        autoHideMenuBar: true,
        skipTaskbar: true,
        frame: false,
        hasShadow: false,
        transparent: true,
        resizable: false, // 禁止缩放
        backgroundColor: '#000000',
        webPreferences: {
            preload,
        },
    })
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    // recordWindow
    const recordWindow = await useRecordWindow()
    // screenshotWindow
    const screenshotWindow = await useScreenshotWindow()

    // keep ratio
    win.setAspectRatio(1)
    // record
    useRecord(recordWindow)
    // screenshot
    useScreenshot(screenshotWindow)
    // image
    useImage()
    // camera
    useCamera()

    if (process.env.VITE_DEV_SERVER_URL) {
        await win.loadURL(url)
        win.webContents.openDevTools({ mode: 'detach' })
    }
    else {
        await win.loadFile(indexHtml)
    }

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:'))
            shell.openExternal(url)
        return { action: 'deny' }
    })

    // 托盘图标
    const isDev = process.env.NODE_ENV === 'development'
    const trayIcon = isDev
        ? join(cwd(), 'build/justrecordTemplate@2x.png')
        : join(cwd(), 'build/justrecordTemplate@2x.png')
    const icon = nativeImage.createFromPath(trayIcon)
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: function () {
                app.quit()
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => { });
}

app.whenReady().then(createWindow)

// 不同平台的交互差异
shim(win, createWindow)

ipcMain.handle('open-win', async (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL)
        await childWindow.loadURL(`${url}#${arg}`)
    else
        await childWindow.loadFile(indexHtml, { hash: arg })
})
