/// <reference types="vite-plugin-electron/electron-env" />

declare interface RecordOptions {
  x: number
  y: number
  width: number
  height: number
  fullScreen: boolean
}

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface Window {
  versions: {
    node: () => string
    chrome: () => string
    electron: () => string
  }
  // expose in the `electron/preload/useDrag.ts`
  useDrag: {
    'drag': (opt: { x: number, y: number }) => void
    'canvas:drag': (opt: { x: number, y: number }) => void
  }

  // expose in the `electron/preload/useRecord.ts`
  useRecord: {
    'show': (flag: boolean = true) => Promise<any>
    'hide': () => Promise<any>
    'start': (recordOptions: RecordOptions) => Promise<any>
    'stop': () => Promise<any>
    'transparentClipWin': () => Promise<any>
    'getCaptureResource': () => Promise<any>

    'saveFile': () => Promise<any>
    'downloadFile': (path: string, file: Uint8Array) => Promise<any>

    'onChangeIcon': (cb: (msg: any) => void) => void
    'onStopRecord': (cb: (msg: any) => void) => void
    'onRecordShow': (cb: (msg: any) => void) => void
    'onRecordHide': (cb: (msg: any) => void) => void
  }
}
