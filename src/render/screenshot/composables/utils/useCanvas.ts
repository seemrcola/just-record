import { nextTick } from 'vue'

export async function useCanvas(
    screenshot: HTMLCanvasElement,
    { x, y, height, width }: { x: number, y: number, height: number, width: number },
    imgID: string,
) {
    // 将画布的这部分绘制到canvas
    const scale = window.devicePixelRatio
    const ctx = screenshot.getContext('2d')!
    // 先按照实际要绘制的大小设置画布大小
    screenshot.width = width * scale
    screenshot.height = height * scale
    // 获取图片
    const img = document.querySelector(`#${imgID}`) as HTMLImageElement
    ctx.drawImage(
        img,
        x * scale,
        y * scale,
        width * scale,
        height * scale,
        0,
        0,
        width * scale,
        height * scale,
    )
    await nextTick()
    screenshot.style.height = `${height}px`
    screenshot.style.width = `${width}px`
    // 设置canvas的位置
    screenshot.style.left = `${x}px`
    screenshot.style.top = `${y}px`
}
