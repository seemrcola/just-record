import { useToolsStore } from '../../store'
import { useDragSVGEllipse } from './dragSvg'
import { useUndo } from './undo'

export function useDrawSVGEllipse(canvas: HTMLCanvasElement, svg: SVGElement) {
    let svgEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')

    const toolsStore = useToolsStore()
    const undo = useUndo(canvas, svg)
    const rect = canvas.getBoundingClientRect()!

    let start = { x: 0, y: 0 }

    const { abs } = Math

    function startDrawEllipse() {
        svg.addEventListener('mousedown', mousedownHandler)
    }

    function stopDrawEllipse() {
        svg.removeEventListener('mousedown', mousedownHandler)
    }

    function mousedownHandler(event: MouseEvent) {
        svgEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHandler)

        const x = (event.clientX - rect.left)
        const y = (event.clientY - rect.top)
        start = { x, y }

        svgEllipse.setAttribute('cx', `${start.x}`)
        svgEllipse.setAttribute('cy', `${start.y}`)

        svg.appendChild(svgEllipse)

        undo.track()
    }

    function mousemoveHandler(event: MouseEvent) {
        const x = (event.clientX - rect.left)
        const y = (event.clientY - rect.top)

        svgEllipse.setAttribute('stroke', getColor())
        svgEllipse.setAttribute('stroke-width', '3')
        svgEllipse.setAttribute('fill', 'none')

        // 计算cx和cy 使我的鼠标开始点和结束点为外接矩形
        const cx = (start.x + x) / 2
        const cy = (start.y + y) / 2
        svgEllipse.setAttribute('cx', `${cx}`)
        svgEllipse.setAttribute('cy', `${cy}`)
        // 处理rx和ry
        const dx = abs(x - start.x)
        const dy = abs(y - start.y)
        const rx = abs(dx / 2)
        const ry = abs(dy / 2)
        svgEllipse.setAttribute('rx', `${rx}`)
        svgEllipse.setAttribute('ry', `${ry}`)
    }

    function mouseupHandler(event: MouseEvent) {
        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHandler)

        // 如果rx ry均为0 则不画椭圆
        const rx = svgEllipse.getAttribute('rx') ?? '0'
        const ry = svgEllipse.getAttribute('ry') ?? '0'
        if (rx === '0' && ry === '0') {
            svg.removeChild(svgEllipse)
            undo.undo()
            return
        }

        useDragSVGEllipse(svgEllipse, svg, undo)
    }

    function getColor() {
        return toolsStore.ellipseColor
    }

    return {
        startDrawEllipse,
        stopDrawEllipse,
    }
}
