import { contextBridge, ipcRenderer } from 'electron'

export function useRecord() {
  const api = {
    start: () => {
      return ipcRenderer.invoke('start')
    },
    startRecord: (recordOptions: RecordOptions) => {
      return ipcRenderer.invoke('startRecord', recordOptions)
    },
    stop: () => {
      return ipcRenderer.invoke('stop')
    },
    hide: () => {
      return ipcRenderer.invoke('hide')
    },
    transparentClipWin: () => {
      return ipcRenderer.invoke('transparentClipWin')
    },
    message: ({ type, msg }: { type: string, msg: any }) => {
      ipcRenderer.send('message', { type, msg })
    },
    del: () => {
      return ipcRenderer.invoke('del')
    },
    getCaptureResource: () => {
      return ipcRenderer.invoke('getCaptureResource')
    },

    // 主进程给渲染进程发送消息
    onChangeIcon: (cb: (msg: any) => void) => {
      ipcRenderer.on('change-icon', (event, msg) => {
        cb(msg)
      })
    },
    onCloseWin: (cb: (msg: any) => void) => {
      ipcRenderer.on('close-win', (event, msg) => {
        cb(msg)
      })
    },
  }

  contextBridge.exposeInMainWorld('useRecord', api)
}
