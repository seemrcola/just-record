import { contextBridge, ipcRenderer } from 'electron'

export function useImage() {
    const api = {
        isofix: (config: IsofixConfig) => {
            return ipcRenderer.invoke('isofix', config)
        },

        onIsofixFinished: (cb: (result: string) => void) => {
            ipcRenderer.on('isofix-finished', (e, result) => {
                cb(result.base64)
            })
        },

        close: () => {
            return ipcRenderer.invoke('close')
        },
    }

    contextBridge.exposeInMainWorld('useImage', api)
}
