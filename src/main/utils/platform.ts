import * as process from 'node:process'
import os from 'node:os'
import { BrowserWindow, app } from 'electron'

function shim(win: BrowserWindow | null, createWindow: () => void) {
  app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin')
      app.quit()
  })

  app.on('second-instance', () => {
    if (win) {
      // Focus on the main window if the user tried to open another
      if (win.isMinimized())
        win.restore()
      win.focus()
    }
  })

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length)
      allWindows[0].focus()
    else
      createWindow()
  })

  // 退出项目时关闭所有窗口
  app.on('before-quit', () => {
    // 获取所有窗口
    const allWindows = BrowserWindow.getAllWindows()
    // 遍历窗口并销毁
    allWindows.forEach((win) => {
      win.destroy()
    })
  })
}

function getPlatform() {
  const platform = os.platform()
  // darwin is macOS
  if (platform === 'darwin')
    return 'mac'

  // win32 is windows
  if (platform === 'win32')
    return 'win'

  // linux is linux
  if (platform === 'linux')
    return 'linux'
}

export {
  getPlatform,
  shim,
}
