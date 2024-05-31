import { useHistoryStore } from '../../store'
import { useDragSVGEllipse, useDragSVGLine, useDragSVGPolyLine, useDragSVGRect } from './dragSvg'

export function useUndo(screenshot: HTMLCanvasElement, svg: SVGElement) {
    const ctx = screenshot.getContext('2d')!
    const { width, height } = screenshot

    const historyStore = useHistoryStore()

    function track() {
        const dataUrl = screenshot.toDataURL()
        const svgData = new XMLSerializer().serializeToString(svg)
        historyStore.history.push({ canvas: dataUrl, svg: svgData })
    }

    function fallback() {
        historyStore.history.pop()
    }

    function undo() {
        const top = historyStore.history.top as any
        if (!top)
            return

        historyStore.history.pop()
        if (top.canvas) {
            const img = new Image()
            img.onload = () => {
                ctx.clearRect(0, 0, width, height)
                ctx.drawImage(img, 0, 0)
            }
            img.src = top.canvas
        }

        if (top.svg) {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(top.svg, 'image/svg+xml')
            svg.innerHTML = xmlDoc.documentElement.innerHTML

            // 获取svg元素，重新绑定事件
            const polylines = svg.querySelectorAll('polyline')
            polylines.forEach((line) => {
                useDragSVGPolyLine(line, svg, { undo, fallback, track })
            })
            const ellipses = svg.querySelectorAll('ellipse')
            ellipses.forEach((ellipse) => {
                useDragSVGEllipse(ellipse, svg, { undo, fallback, track })
            })
            const rects = svg.querySelectorAll('rect')
            rects.forEach((rect) => {
                useDragSVGRect(rect, svg, { undo, fallback, track })
            })
            const lines = svg.querySelectorAll('line')
            lines.forEach((line) => {
                useDragSVGLine(line, svg, { undo, fallback, track })
            })
        }
    }

    return {
        track,
        undo,
        fallback,
    }
}
