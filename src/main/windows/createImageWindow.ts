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
const imageHtml = join(process.env.DIST, 'image.html')

export async function useImageWindow(config: IsofixConfig) {
    const childWindow = new BrowserWindow({
        width: config.width,
        height: config.height,
        title: 'Image',
        x: config.x,
        y: config.y,

        frame: false, // 无边框窗口
        resizable: true, // 窗口大小是否可调整
        hasShadow: true, // 窗口是否有阴影
        transparent: false, // 使窗口透明
        webPreferences: {
            preload,
        },
    })
    // 窗口置顶
    childWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    // 最上层
    childWindow.setAlwaysOnTop(true, 'screen-saver')

    // 缩放时维持比例
    childWindow.setAspectRatio(config.width / config.height)

    childWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:'))
            shell.openExternal(url)
        return { action: 'deny' }
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        await childWindow.loadURL(`${url}image.html`)
        0 && childWindow.webContents.openDevTools({ mode: 'detach' })
    }

    else { await childWindow.loadFile(imageHtml) }

    return childWindow
}
