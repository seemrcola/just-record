import { contextBridge } from 'electron'

export function useVersions() {
    const api = {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
    }

    contextBridge.exposeInMainWorld('useVersions', api)
}
