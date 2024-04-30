import { dirname, join } from 'node:path'
import * as process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, shell } from 'electron'

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

const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const cameraHtml = join(process.env.DIST, 'camera.html')

export async function useCameraWindow() {
  const childWindow = new BrowserWindow({
    width: 240,
    height: 240,
    title: 'Camera',
    show: false,
    x: 200,
    y: 200,

    movable: false, // 是否可移动
    frame: false, // 无边框窗口
    resizable: false, // 窗口大小是否可调整
    hasShadow: false, // 窗口是否有阴影
    transparent: true, // 使窗口透明
    webPreferences: {
      preload,
    },
  })

  // 设置窗口在所有工作区都可见
  childWindow.setVisibleOnAllWorkspaces(true)
  // 最上层
  childWindow.setAlwaysOnTop(true, 'screen-saver')

  childWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    await childWindow.loadURL(`${url}camera.html`)
    0 && childWindow.webContents.openDevTools({ mode: 'detach' })
  }

  else { await childWindow.loadFile(cameraHtml) }

  return childWindow
}
