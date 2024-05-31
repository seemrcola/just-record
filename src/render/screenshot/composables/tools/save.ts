export function useSaveScreenshot(screenshot: HTMLCanvasElement, svg: SVGElement) {
    const ctx = screenshot.getContext('2d')!
    const { width, height } = screenshot

    function save() {
        return new Promise((resolve, reject) => {
            // 获取svg内容
            const xml = new XMLSerializer().serializeToString(svg)
            const svgUrl = `data:image/svg+xml;base64,${btoa(xml)}`
            const img = new Image()
            img.src = svgUrl
            img.onload = () => {
                // 考虑设备像素比例
                const ratio = window.devicePixelRatio || 1
                // 在绘制之前调整Canvas缩放
                ctx.scale(ratio, ratio)
                // 将 SVG 绘制到 Canvas 上，考虑缩放比
                ctx.drawImage(img, 0, 0, width / ratio, height / ratio)
                // 恢复 Canvas 缩放
                ctx.scale(1 / ratio, 1 / ratio)
                saveCanvasAsPng(resolve, reject)
            }
        })
    }

    function saveCanvasAsPng(resolve: (value: boolean) => void, reject: (reason: any) => void) {
        screenshot.toBlob((blob) => {
            // 使用Clipboard API写入剪贴板
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob as Blob,
                }),
            ])
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    console.error('Error copying image to clipboard', error)
                    reject(false)
                })
        }, 'image/png')
    }

    return {
        save,
    }
}
