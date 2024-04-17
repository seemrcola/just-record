import { BrowserWindow, ipcMain } from 'electron'

export function useCamera(win: BrowserWindow) {
  ipcMain.handle('camera:open', () => {
    win.show()
    // 获取全部窗口

    const allWindows = BrowserWindow.getAllWindows()
    // 遍历窗口通知所有窗口已经打开摄像头
    allWindows.forEach((window) => {
      window.webContents.send('camera-opened')
    })
  })

  ipcMain.handle('camera:close', () => {
    win.hide()

    const allWindows = BrowserWindow.getAllWindows()
    // 遍历窗口通知所有窗口已经打开摄像头
    allWindows.forEach((window) => {
      window.webContents.send('camera-closed')
    })
  })
}
