import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron'

function getSize() {
    const { size, scaleFactor } = screen.getPrimaryDisplay()
    return [size.width * scaleFactor, size.height * scaleFactor]
}

export function useScreenshot(win: BrowserWindow) {
    ipcMain.handle('shot:open', async () => {
        win.show()

        // 获取全屏截图
        let thumbnail: string | null = null
        const [width, height] = getSize()
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width, height },
        })
        for (const source of sources) {
            if (source.id === 'screen:1:0') {
                thumbnail = source.thumbnail.toDataURL()
                break
            }
        }

        const allWindows = BrowserWindow.getAllWindows()
        // 遍历窗口通知所有窗口已经打开摄像头
        allWindows.forEach((window) => {
            if (true)
                window.webContents.send('shot-opened', { thumbnail })
        })
    })

    ipcMain.handle('shot:close', () => {
        win.hide()

        const allWindows = BrowserWindow.getAllWindows()
        // 遍历窗口通知所有窗口已经打开摄像头
        allWindows.forEach((window) => {
            window.webContents.send('shot-closed')
        })
    })
}
