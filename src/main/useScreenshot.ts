import { BrowserWindow, ipcMain } from 'electron'

export function useScreenshot(win: BrowserWindow) {
  ipcMain.handle('shot:open', () => {
    win.show()
    // 获取全部窗口

    const allWindows = BrowserWindow.getAllWindows()
    // 遍历窗口通知所有窗口已经打开摄像头
    allWindows.forEach((window) => {
      window.webContents.send('shot-opened')
    })
  })

  ipcMain.handle('shot:close', () => {
    win.hide()

    const allWindows = BrowserWindow.getAllWindows()
    // 遍历窗口通知所有窗口已经打开摄像头
    allWindows.forEach((window) => {
      window.webContents.send('shot-closed')
    })
  })
}
