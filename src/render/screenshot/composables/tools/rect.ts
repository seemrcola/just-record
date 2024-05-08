import { useToolsStore } from '../../store'

export function useDrawSVGRect(canvas: HTMLCanvasElement, svg: SVGElement) {
  let svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

  const toolsStore = useToolsStore()
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
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    const width = abs(x - start.x)
    const height = abs(y - start.y)

    // 如果跨过了初始点
    if (x < start.x) svgRect.setAttribute('x', `${x}`)
    if (y < start.y) svgRect.setAttribute('y', `${y}`)

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
    useDragSVG(svgRect)
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
) {
  let startFlag = false
  let start = { x: 0, y: 0 }

  target.addEventListener('mousedown', mousedownHandler)
  target.style.position = 'fixed'

  function mousedownHandler(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startFlag = true
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    start = { x: e.pageX, y: e.pageY }
  }

  function mousemoveHandler(e: MouseEvent) {
    if (!startFlag)
      return

    const { pageX, pageY } = e
    const { x, y } = start
    const deltaX = pageX - x
    const deltaY = pageY - y
    updatePolylinePoints(deltaX, deltaY, target);

    start = { x: pageX, y: pageY }
  }

  function mouseupHandler(e: MouseEvent) {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
    const x = parseInt(ele.getAttribute('x')!)
    const y = parseInt(ele.getAttribute('y')!)
    ele.setAttribute('x', `${x + dx}`)
    ele.setAttribute('y', `${y + dy}`)
  }
}
