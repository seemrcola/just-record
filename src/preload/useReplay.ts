import { contextBridge, ipcRenderer } from 'electron'

export function useReplay() {
  const api = {
    open: () => {
      return ipcRenderer.invoke('start')
    },
    close: () => {
      return ipcRenderer.invoke('close')
    },
  }

  contextBridge.exposeInMainWorld('useReplay', api)
}
