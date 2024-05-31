export function useDownload(canvas: HTMLCanvasElement, svg: SVGElement) {
    const ctx = canvas.getContext('2d')!
    const { width, height } = canvas

    return new Promise((resolve) => {
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

            const base64 = canvas.toDataURL()
            // 保存到本地
            const link = document.createElement('a')
            link.download = 'just-record.png'
            link.href = base64
            link.click()
            link.remove()

            resolve(true)
        }
    })
}
