/// <reference types="vite-plugin-electron/electron-env" />

declare interface RecordOptions {
  x: number
  y: number
  width: number
  height: number
  fullScreen: boolean
}

declare interface IsofixConfig {
  height: number
  width: number
  x: number
  y: number
  base64: string
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

    'onStartRecord': (cb: () => void) => void
    'onStopRecord': (cb: () => void) => void
    'onRecordShow': (cb: () => void) => void
    'onRecordHide': (cb: () => void) => void
  }

  // expose in the `electron/preload/useCamera.ts`
  useCamera: {
    'open': () => Promise<any>
    'close': () => Promise<any>
    'onCameraOpened': (cb: () => void) => void
    'onCameraClosed': (cb: () => void) => void
  }

  // expose in the `electron/preload/useScreenshot.ts`
  useScreenshot: {
    'open': () => Promise<any>
    'close': () => Promise<any>
    'onScreenshotOpened': (cb: (thumbnail: string) => void) => void
    'onScreenshotClosed': (cb: () => void) => void
  }

  useImage: {
    'isofix': (config: IsofixConfig) => Promise<any>
    'onIsofixFinished': (cb: (res: string) => void) => void
    'close': () => Promise<any>
  }
}
