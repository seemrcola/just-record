import { contextBridge, ipcRenderer } from 'electron'

export function useCamera() {
  const api = {
    open: async () => {
      await ipcRenderer.invoke('camera:open')
    },

    close: async () => {
      await ipcRenderer.invoke('camera:close')
    },

    onCameraOpened: (cb: () => void) => {
      ipcRenderer.on('camera-opened', () => {
        cb()
      })
    },

    onCameraClosed: (cb: () => void) => {
      ipcRenderer.on('camera-closed', () => {
        cb()
      })
    },
  }

  contextBridge.exposeInMainWorld('useCamera', api)
}
