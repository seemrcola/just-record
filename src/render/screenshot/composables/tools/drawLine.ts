import { useToolsStore } from '../../store'

export function useDrawLine(proxyDOM: HTMLElement, canvas: HTMLCanvasElement, svg: SVGElement) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  let innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

  const toolsStore = useToolsStore()
  const rect = canvas.getBoundingClientRect()!
  let points: string[] = []

  function startDrawLine() {
    proxyDOM.addEventListener('mousedown', mousedownHandler)
  }

  function stopDrawLine() {
    proxyDOM.removeEventListener('mousedown', mousedownHandler)
  }

  function mousedownHandler(event: MouseEvent) {
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    // 一根我们想画的线
    line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    line.setAttribute('stroke', `${getColor()}`)
    line.setAttribute('stroke-width', `${getLineWidth()}`)
    line.setAttribute('fill', 'none')
    points.push(`${x},${y}`)
    line.setAttribute('points', `${points.join(' ')}`)
    // 中间画一根黑色的线
    innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    innerLine.setAttribute('stroke', 'white')
    innerLine.setAttribute('stroke-width', '1')
    innerLine.setAttribute('fill', 'none')
    innerLine.setAttribute('points', `${points.join(' ')}`)
    svg.appendChild(innerLine)

    svg.appendChild(line)
    svg.appendChild(innerLine)
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

    // 如果和最后一个点的绝对距离小于3，则不画线
    const lastPoint = points[points.length - 1]
    const [lx, ly] = lastPoint.split(',')
    const distance = Math.sqrt(Math.pow(x - parseInt(lx), 2) + Math.pow(y - parseInt(ly), 2))
    if (distance < 3) return

    points.push(`${x},${y}`)
    line.setAttribute('points', `${points.join(' ')}`)
    innerLine.setAttribute('points', `${points.join(' ')}`)
  }

  function mouseupHandler(event: MouseEvent) {
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
    points = []
    innerLine.remove()
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
