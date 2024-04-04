import { BrowserWindow, ipcMain } from 'electron'

export async function useReplay(replayWin: BrowserWindow) {
  ipcMain.handle('open', () => {
    replayWin.show()
  })

  ipcMain.handle('close', () => {
    replayWin.hide()
  })
}
