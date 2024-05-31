import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useMosaic(canvas: HTMLCanvasElement, svg: SVGElement) {
    const store = useToolsStore()
    const undo = useUndo(canvas, svg)

    const ratio = window.devicePixelRatio
    // 获取到画布的rect
    const rect = canvas.getBoundingClientRect()
    // 拿到画布的上下文
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    // 定义一个函数，用于绘制马赛克(可以重涂)
    function drawMosaicHeavily(point: { x: number, y: number }, size: number) {
    // 取出当前点周围半径为size的矩形
        const area = {
            x: Math.floor(point.x - size / 2),
            y: Math.floor(point.y - size / 2),
            width: size,
            height: size,
        }
        // 填充颜色
        const color = getMosaicColor({ x: area.x, y: area.y }, size)
        ctx.fillStyle = color
        // 绘制矩形
        ctx.fillRect(area.x, area.y, size, size)
    }

    function drawMosaicLightly(point: { x: number, y: number }, size: number) {
    // 首先将整个画布的像素点按照size进行分割，分割成多个size * size的小方格
    // 要算出当前point所处的小方格
        const gridX = Math.floor(point.x / size)
        const gridY = Math.floor(point.y / size)
        // 算出这个所处小方格的左上角坐标
        const gridLeft = gridX * size
        const gridTop = gridY * size
        // 计算颜色
        const color = getMosaicColor({ x: gridLeft, y: gridTop }, size)
        // 绘制矩形
        ctx.fillStyle = color
        // ctx.fillStyle = 'red'
        ctx.fillRect(gridLeft, gridTop, size, size)
    }

    /**
     * @param point  左上角坐标
     * @param size   正方形区域大小
     * @returns      马赛克颜色值
     */
    function getMosaicColor(point: { x: number, y: number }, size: number) {
    // 计算出马赛克的颜色值
    // 获取正方形区域的像素数据
    // willReadFrequently设置为true，会缓存该区域的像素数据，提升性能
        const imageData = ctx.getImageData(point.x, point.y, size, size)
        const data = imageData.data

        let r = 0; let g = 0; let b = 0; let a = 0
        let pixelCount = 0

        // 遍历正方形区域内的所有像素
        for (let i = 0; i < data.length; i += 4) {
            r += data[i] // 红色值
            g += data[i + 1] // 绿色值
            b += data[i + 2] // 蓝色值
            a += data[i + 3] // 透明度值
            pixelCount++
        }

        // 计算平均颜色值
        r = Math.round(r / pixelCount)
        g = Math.round(g / pixelCount)
        b = Math.round(b / pixelCount)
        a = Math.round(a / pixelCount)

        // 返回计算出的平均颜色值的 rgba 字符串
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`
    }

    function startMosaic() {
        canvas.addEventListener('mousedown', mousedownHanlder)
    }

    function stopMosaic() {
        canvas.removeEventListener('mousedown', mousedownHanlder)
    }

    function mousedownHanlder(event: MouseEvent) {
        document.addEventListener('mousemove', mousemoveHanlder)
        document.addEventListener('mouseup', mouseupHanlder)

        undo.track()
    }

    function mousemoveHanlder(event: MouseEvent) {
        const { pageX, pageY } = event
        const x = (pageX - rect.left) * ratio
        const y = (pageY - rect.top) * ratio

        const mosaicRadius = getMosaicSize()

        if (store.mosaicType === 'heavy')
            drawMosaicHeavily({ x, y }, mosaicRadius)
        if (store.mosaicType === 'light')
            drawMosaicLightly({ x, y }, mosaicRadius)
    }

    function mouseupHanlder() {
        document.removeEventListener('mousemove', mousemoveHanlder)
        document.removeEventListener('mouseup', mouseupHanlder)
    }

    function getMosaicSize() {
        if (store.mosaicSize === 'small')
            return 24
        if (store.mosaicSize === 'medium')
            return 36
        if (store.mosaicSize === 'large')
            return 48

        return 24
    }

    return {
        startMosaic,
        stopMosaic,
    }
}
