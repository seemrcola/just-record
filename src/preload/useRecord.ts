import { contextBridge, ipcRenderer } from 'electron'

export function useRecord() {
  const api = {
    show: (flag: boolean = true) => {
      return ipcRenderer.invoke('show', flag)
    },
    hide: () => {
      return ipcRenderer.invoke('hide')
    },
    start: (recordOptions: RecordOptions) => {
      return ipcRenderer.invoke('start', recordOptions)
    },
    stop: () => {
      return ipcRenderer.invoke('stop')
    },
    transparentClipWin: () => {
      return ipcRenderer.invoke('transparentClipWin')
    },
    message: ({ type, msg }: { type: string, msg: any }) => {
      ipcRenderer.send('message', { type, msg })
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
    onStopRecord: (cb: (msg: any) => void) => {
      ipcRenderer.on('stop-record', (event, msg) => {
        cb(msg)
      })
    },
    onRecordShow: (cb: (msg: any) => void) => {
      ipcRenderer.on('record-show', (event, msg) => {
        cb(msg)
      })
    },
    onRecordHide: (cb: (msg: any) => void) => {
      ipcRenderer.on('record-hide', (event, msg) => {
        cb(msg)
      })
    },
  }

  contextBridge.exposeInMainWorld('useRecord', api)
}
