import { BrowserWindow, ipcMain } from 'electron'
import { useCameraWindow } from './windows/createCameraWindow'

export function useCamera() {
    let win: BrowserWindow
    ipcMain.handle('camera:open', async () => {
        win = await useCameraWindow()

        const allWindows = BrowserWindow.getAllWindows()
        // 遍历窗口通知所有窗口已经打开摄像头
        allWindows.forEach((window) => {
            window.webContents.send('camera-opened')
        })
    })

    ipcMain.handle('camera:close', () => {
        win.destroy()

        const allWindows = BrowserWindow.getAllWindows()
        // 遍历窗口通知所有窗口已经打开摄像头
        allWindows.forEach((window) => {
            window.webContents.send('camera-closed')
        })
    })
}
