import { dirname, join } from 'node:path'
import * as process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, screen } from 'electron'

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
console.log('preload:', preload)
const url = process.env.VITE_DEV_SERVER_URL
const replayHtml = join(process.env.DIST, 'replay.html')

function getSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return [size.width * scaleFactor, size.height * scaleFactor]
}

export async function useReplayWindow() {
  const [width, height] = getSize()

  const childWindow = new BrowserWindow({
    width,
    height,
    title: 'Replay',
    show: false,

    // movable: false,
    // frame: false,
    // resizable: false,
    // fullscreen: platform === 'win',
    // transparent: true,
    // simpleFullscreen: true,

    movable: false, // 是否可移动
    frame: false, // 无边框窗口
    resizable: false, // 窗口大小是否可调整
    hasShadow: false, // 窗口是否有阴影
    transparent: true, // 使窗口透明
    autoHideMenuBar: true, // 自动隐藏菜单栏
    useContentSize: true, // width 和 height 将设置为 web 页面的尺寸
    fullscreenable: true, // 窗口是否可以进入全屏状态
    fullscreen: true, // 窗口是否全屏
    simpleFullscreen: true, // 在 macOS 上使用 pre-Lion 全屏
    webPreferences: {
      preload,
    },
  })

  // 设置窗口在所有工作区都可见
  childWindow.setVisibleOnAllWorkspaces(true)
  // 最上层
  // childWindow.setAlwaysOnTop(true, 'screen-saver')

  if (process.env.VITE_DEV_SERVER_URL) {
    await childWindow.loadURL(`${url}replay.html`)
    childWindow.webContents.openDevTools({ mode: 'detach' })
  }
  else {
    await childWindow.loadFile(replayHtml)
  }

  return childWindow
}
