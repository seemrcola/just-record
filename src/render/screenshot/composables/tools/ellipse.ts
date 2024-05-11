import { useToolsStore } from '../../store'
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

    undo.track('svg')
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    const rx = abs(x - start.x)
    const ry = abs(y - start.y)

    svgEllipse.setAttribute('rx', `${rx}`)
    svgEllipse.setAttribute('ry', `${ry}`)
    svgEllipse.setAttribute('stroke', getColor())
    svgEllipse.setAttribute('stroke-width', '3')
    svgEllipse.setAttribute('fill', 'none')
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

    useDragSVG(svgEllipse, undo)
  }

  function getColor() {
    return toolsStore.ellipseColor
  }

  return {
    startDrawEllipse,
    stopDrawEllipse,
  }
}

function useDragSVG(
  target: SVGElement,
  undo: ReturnType<typeof useUndo>
) {
  let startFlag = false
  let start = { x: 0, y: 0 }

  target.onmousedown = mousedownHandler
  target.style.position = 'fixed'

  function mousedownHandler(e: MouseEvent) {
    
    e.stopPropagation()

    startFlag = true
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    start = { x: e.pageX, y: e.pageY }

    undo.track('svg')
  }

  function mousemoveHandler(e: MouseEvent) {
    
    e.stopPropagation()

    if (!startFlag)
      return

    const { pageX, pageY } = e
    const { x, y } = start
    const deltaX = pageX - x
    const deltaY = pageY - y
    updatePolylinePoints(deltaX, deltaY, target)

    start = { x: pageX, y: pageY }
  }

  function mouseupHandler(e: MouseEvent) {
    
    e.stopPropagation()

    startFlag = false
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
    const x = Number.parseInt(ele.getAttribute('cx')!)
    const y = Number.parseInt(ele.getAttribute('cy')!)
    ele.setAttribute('cx', `${x + dx}`)
    ele.setAttribute('cy', `${y + dy}`)
  }
}
