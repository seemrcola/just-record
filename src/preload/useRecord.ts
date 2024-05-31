import { contextBridge, ipcRenderer } from 'electron'

export function useRecord() {
    const api = {
        show: (flag: boolean = true) => {
            return ipcRenderer.invoke('recorder:show', flag)
        },
        hide: () => {
            return ipcRenderer.invoke('recorder:hide')
        },
        start: (recordOptions: RecordOptions) => {
            return ipcRenderer.invoke('recorder:start', recordOptions)
        },
        stop: () => {
            return ipcRenderer.invoke('recorder:stop')
        },
        transparentClipWin: () => {
            return ipcRenderer.invoke('recorder:transparentClipWin')
        },
        getCaptureResource: () => {
            return ipcRenderer.invoke('recorder:getCaptureResource')
        },

        saveFile: () => {
            return ipcRenderer.invoke('recorder:saveFile')
        },
        downloadFile: (path: string, file: Uint8Array) => {
            return ipcRenderer.invoke('recorder:downloadFile', {
                path,
                file,
            })
        },

        // 主进程给渲染进程发送消息
        onStartRecord: (cb: () => void) => {
            ipcRenderer.on('start-record', () => {
                cb()
            })
        },
        onStopRecord: (cb: () => void) => {
            ipcRenderer.on('stop-record', () => {
                cb()
            })
        },
        onRecordShow: (cb: () => void) => {
            ipcRenderer.on('record-show', () => {
                cb()
            })
        },
        onRecordHide: (cb: () => void) => {
            ipcRenderer.on('record-hide', () => {
                cb()
            })
        },
    }

    contextBridge.exposeInMainWorld('useRecord', api)
}
