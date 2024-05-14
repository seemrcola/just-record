import { useToolsStore } from '../../store'
import { useUndo } from './undo'
import { useDragSVGPolyLine } from './dragSvg'

export function useDrawSVGLine(canvas: HTMLCanvasElement, svg: SVGElement) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  let innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

  const toolsStore = useToolsStore()
  const undo = useUndo(canvas, svg)
  const rect = canvas.getBoundingClientRect()!
  let points: string[] = []

  function startDrawLine() {
    svg.addEventListener('mousedown', mousedownHandler)
  }

  function stopDrawLine() {
    svg.removeEventListener('mousedown', mousedownHandler)
  }

  function drawLine(svg: SVGElement, color: string, lineWidth: number) {
    svg.setAttribute('stroke', `${color}`)
    svg.setAttribute('stroke-width', `${lineWidth}`)
    svg.setAttribute('fill', 'none')
    svg.setAttribute('points', `${points.join(' ')}`)
  }

  function mousedownHandler(event: MouseEvent) {
    undo.track()

    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    points.push(`${x},${y}`)

    // 一根我们想画的线
    line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    drawLine(line, getColor(), getLineWidth())
    // 中间画一根黑色的线
    innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    drawLine(innerLine, 'white', 1)

    svg.appendChild(line)
    svg.appendChild(innerLine)
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    // 如果和最后一个点的绝对距离小于3，则不画线
    const lastPoint = points[points.length - 1]
    const [lx, ly] = lastPoint.split(',')
    const distance = Math.sqrt((x - Number.parseInt(lx)) ** 2 + (y - Number.parseInt(ly)) ** 2)
    if (distance < 3)
      return

    points.push(`${x},${y}`)
    line.setAttribute('points', `${points.join(' ')}`)
    innerLine.setAttribute('points', `${points.join(' ')}`)
  }

  function mouseupHandler(event: MouseEvent) {
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
    points = []
    innerLine.remove()

    // 如果线长度为0，则不画线
    const pointsArray = line.getAttribute('points')!.split(' ')
    if (pointsArray.length < 2) {
      line.remove()
      undo.fallback()
      return
    }

    // 添加拖拽能力
    useDragSVGPolyLine(line, svg, undo)
  }

  function getColor() {
    return toolsStore.penColor
  }

  function getLineWidth() {
    if (toolsStore.penSize === 'small')
      return 3
    else if (toolsStore.penSize === 'medium')
      return 5
    else if (toolsStore.penSize === 'large')
      return 7
    return 1
  }

  return {
    startDrawLine,
    stopDrawLine,
  }
}
