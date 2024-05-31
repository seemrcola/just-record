import { contextBridge, ipcRenderer } from 'electron'

export function useScreenshot() {
    const api = {
        open: async () => {
            await ipcRenderer.invoke('shot:open')
        },

        close: async () => {
            await ipcRenderer.invoke('shot:close')
        },

        onScreenshotOpened: (cb: (thumbnail: string) => void) => {
            ipcRenderer.on('shot-opened', (e, { thumbnail }) => {
                cb(thumbnail)
            })
        },

        onScreenshotClosed: (cb: () => void) => {
            ipcRenderer.on('shot-closed', () => {
                cb()
            })
        },
    }

    contextBridge.exposeInMainWorld('useScreenshot', api)
}
