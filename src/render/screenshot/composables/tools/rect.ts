import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useDrawSVGRect(canvas: HTMLCanvasElement, svg: SVGElement) {
  let svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

  const toolsStore = useToolsStore()
  const undo = useUndo(canvas, svg)
  const rect = canvas.getBoundingClientRect()!

  let start = { x: 0, y: 0 }

  const { abs } = Math

  function startDrawRect() {
    svg.addEventListener('mousedown', mousedownHandler)
  }

  function stopDrawRect() {
    svg.removeEventListener('mousedown', mousedownHandler)
  }

  function mousedownHandler(event: MouseEvent) {
    svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)

    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)
    start = { x, y }

    svgRect.setAttribute('x', `${start.x}`)
    svgRect.setAttribute('y', `${start.y}`)

    svg.appendChild(svgRect)

    undo.track('svg')
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    const width = abs(x - start.x)
    const height = abs(y - start.y)

    // 如果跨过了初始点
    if (x < start.x)
      svgRect.setAttribute('x', `${x}`)
    if (y < start.y)
      svgRect.setAttribute('y', `${y}`)

    svgRect.setAttribute('width', `${width}`)
    svgRect.setAttribute('height', `${height}`)
    svgRect.setAttribute('stroke', getColor())
    svgRect.setAttribute('stroke-width', '3')
    svgRect.setAttribute('fill', 'none')
    svgRect.setAttribute('rx', '5')
    svgRect.setAttribute('ry', '5')
  }

  function mouseupHandler(event: MouseEvent) {
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
    // 如果矩形的宽和高都为0，则删除该矩形
    const w = svgRect.getAttribute('width') ?? '0'
    const h = svgRect.getAttribute('height') ?? '0'
    if(w === '0' && h === '0') {
      svg.removeChild(svgRect)
      undo.undo()
      return 
    }
    useDragSVG(svgRect, svg, undo)
  }

  function getColor() {
    return toolsStore.rectColor
  }

  return {
    startDrawRect,
    stopDrawRect,
  }
}

function useDragSVG(
  target: SVGElement,
  parent: SVGElement,
  undo: ReturnType<typeof useUndo>
) {
  let startFlag = false
  let start = { x: 0, y: 0 }
  let innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

  target.onmousedown = mousedownHandler
  target.style.position = 'fixed'

  function mousedownHandler(e: MouseEvent) {
    
    e.stopPropagation()

    startFlag = true
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    start = { x: e.pageX, y: e.pageY }

    undo.track('svg')

    flagDrawing()
  }

  function mousemoveHandler(e: MouseEvent) {
    e.stopPropagation()

    if (!startFlag)
      return

    const { pageX, pageY } = e
    const { x, y } = start
    const deltaX = pageX - x
    const deltaY = pageY - y

    updatePolylinePoints(deltaX, deltaY, innerSvg)
    updatePolylinePoints(deltaX, deltaY, target)

    start = { x: pageX, y: pageY }
  }

  function mouseupHandler(e: MouseEvent) {
    e.stopPropagation()
    startFlag = false

    innerSvg?.remove()

    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function flagDrawing() { 
    innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    const x = target.getAttribute('x') || '0'
    const y = target.getAttribute('y') || '0'
    const width = target.getAttribute('width') || '0'
    const height = target.getAttribute('height') || '0'

    innerSvg.setAttribute('x', x)
    innerSvg.setAttribute('y', y)
    innerSvg.setAttribute('width', width)
    innerSvg.setAttribute('height', height)

    innerSvg.setAttribute('style', 'fill:none;stroke:white;stroke-width:1')
    parent.appendChild(innerSvg)
   }

  function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
    const x = Number.parseInt(ele.getAttribute('x')!)
    const y = Number.parseInt(ele.getAttribute('y')!)
    ele.setAttribute('x', `${x + dx}`)
    ele.setAttribute('y', `${y + dy}`)
  }
}
