import fs from 'node:fs'
import { promisify } from 'node:util'
import { BrowserWindow, desktopCapturer, dialog, ipcMain } from 'electron'

export async function useRecord(recordWin: BrowserWindow) {
  ipcMain.handle('recorder:show', (_, flag: boolean) => {
    recordWin.show()
    // 通知给渲染进程 窗口已显示
    const allWindows = BrowserWindow.getAllWindows()
    allWindows.forEach((win) => {
      if (win.title === 'Record')
        win.webContents.send('record-show')
    })
  })

  ipcMain.handle('recorder:hide', () => {
    // 开始录制前可隐藏窗口
    recordWin.hide()
    // 通知给渲染进程 窗口已隐藏
    const allWindows = BrowserWindow.getAllWindows()
    allWindows.forEach((win) => {
      if (win.title === 'Record')
        win.webContents.send('record-hide')
    })
  })

  ipcMain.handle('recorder:start', (_, recordOptions: RecordOptions) => {
    // 获取所有窗口
    const allWindows = BrowserWindow.getAllWindows()
    allWindows.forEach((win) => {
      win.webContents.send('start-record', true) // change-icon 的 msg 是 boolean
    })
  })

  ipcMain.handle('recorder:stop', async () => {
    // 将窗口不再设置成可穿透
    recordWin.setIgnoreMouseEvents(false)
    // 录制结束事件发送
    recordWin.webContents.send('stop-record')
    // 获取所有窗口
    const allWindows = BrowserWindow.getAllWindows()
    // 状态改变事件发送 这里将状态改变和结束录制分成了两个事件
    allWindows.forEach((win) => {
      win.webContents.send('change-icon', false) // change-icon 的 msg 是 boolean
    })
  })

  ipcMain.handle('recorder:transparentClipWin', () => {
    // 设置窗口为可穿透
    recordWin.setIgnoreMouseEvents(true)
  })

  ipcMain.handle('recorder:saveFile', () => {
    // 弹出保存文件对话框
    const result = dialog.showSaveDialog(recordWin, {
      title: '保存文件',
      defaultPath: 'record.webm',
    })
    return result
  })

  ipcMain.handle('recorder:downloadFile', async (_, { path, file }) => {
    const writeFile = promisify(fs.writeFile)
    try {
      await writeFile(path, file)
      return true
    }
    catch (error) {
      console.error(error)
      return false
    }
  })

  ipcMain.handle('recorder:getCaptureResource', async () => {
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] })
    for (const source of sources) {
      if (source.id === 'screen:1:0') {
        return {
          id: source.id,
          name: source.name,
          thumbnail: source.thumbnail.toDataURL(),
          display_id: source.display_id,
        }
      }
    }
    return {}
  })
}
