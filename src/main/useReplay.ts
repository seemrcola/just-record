import type { BrowserWindow } from 'electron'
import { ipcMain, ipcRenderer } from 'electron'

export async function useReplay(replayWin: BrowserWindow) {
  ipcMain.handle('open', () => {
    // 显示回放窗口
    replayWin.show()
  })

  ipcMain.handle('close', () => {
    replayWin.hide()
  })

  // 主进程给渲染进程发送消息
  onSendFile: (cb: (filePath: string) => void) => {
    ipcRenderer.on('send-file', (event, filePath: string) => {
      cb(filePath)
    })
  }
}
