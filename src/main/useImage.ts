import { ipcMain, BrowserWindow } from 'electron'
import { useImageWindow } from './windows/createImageWindow'

const imgWinList: BrowserWindow[] = []
export function useImage() {
  ipcMain.handle('isofix', async (event, opt: IsofixConfig) => {
    // 创建一个窗口
    const win = await useImageWindow(opt)
    // 将opt.base64数据传给win
    // 新窗口有一个1000ms的loading时间
    setTimeout(() => {
      win.webContents.send('isofix-finished', { base64: opt.base64 })
      imgWinList.push(win)
    }, 1000)
  })

  ipcMain.handle('close', async () => {
    imgWinList.forEach(win => {
      win.destroy()
    })
    imgWinList.length = 0
  })
}
