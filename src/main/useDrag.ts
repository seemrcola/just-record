import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

export function useDrag(win: BrowserWindow) {
  // listen drag event
  ipcMain.handle('drag', (event, opt: { x: number, y: number }) => {
    // get current window position
    const [x, y] = win.getPosition()
    // move window to new position
    win.setPosition(x + opt.x, y + opt.y)
  })
}

export function useCameraDrag(win: BrowserWindow) {
  // listen camera drag event
  ipcMain.handle('camera:drag', (event, opt: { x: number, y: number }) => {
    // get current window position
    const [x, y] = win.getPosition()
    // move window to new position
    win.setPosition(x + opt.x, y + opt.y)
  })
}
