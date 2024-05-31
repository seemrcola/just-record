import { BrowserWindow, ipcMain } from 'electron'
import { useImageWindow } from './windows/createImageWindow'

export function useImage() {
    const imgWinList: BrowserWindow[] = []

    ipcMain.handle('isofix', async (event, opt: IsofixConfig) => {
    // 创建一个窗口
        const win = await useImageWindow(opt)
        // 将opt.base64数据传给win
        // 缓冲500ms
        setTimeout(() => {
            win.webContents.send('isofix-finished', { base64: opt.base64 })
            imgWinList.push(win)
        }, 500)
    })

    ipcMain.handle('close', async (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)!
        const index = imgWinList.indexOf(win)
        if (index > -1) {
            imgWinList.splice(index, 1)
            win.destroy()
        }
    })
}
