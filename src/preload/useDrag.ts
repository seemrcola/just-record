import { contextBridge, ipcRenderer } from 'electron'

interface dragOptions {
  x: number
  y: number
}

export function useDrag() {
  const api = {
    'drag': async (opt: dragOptions) => {
      await ipcRenderer.invoke('drag', opt)
    },
  }

  contextBridge.exposeInMainWorld('useDrag', api)
}
