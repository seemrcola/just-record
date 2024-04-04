import { contextBridge, ipcRenderer } from 'electron'

export function useReplay() {
  const api = {
    open: () => {
      return ipcRenderer.invoke('open')
    },
    close: () => {
      return ipcRenderer.invoke('close')
    },
    onReplayFile: (cb: (filePath: any) => void) => {
      ipcRenderer.on('replay-file', (event, filePath) => {
        cb(filePath)
      })
    },
  }

  contextBridge.exposeInMainWorld('useReplay', api)
}
