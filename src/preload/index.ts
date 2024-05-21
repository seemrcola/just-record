import { useLoading } from './useLoading'
import { useDrag } from './useDrag'
import { useRecord } from './useRecord'
import { useVersions } from './useVersions'
import { useCamera } from './useCamera'
import { useScreenshot } from './useScreenshot'
import { useImage } from './useImage'
import './ipcRender'

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    }
    else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState))
          resolve(true)
      })
    }
  })
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev: any) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 1000)

// versions----------
useVersions()
// drag--------------
useDrag()
// record------------
useRecord()
// camera-----------
useCamera()
// useScreenshot-----
useScreenshot()
// useImage----------
useImage()
