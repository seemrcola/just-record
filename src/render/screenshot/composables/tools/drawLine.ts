import { useToolsStore } from "../../store"

export function useDrawLine(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!

  const toolsStore = useToolsStore()
  const rect = canvas.getBoundingClientRect()!
  const ratio = window.devicePixelRatio || 1
  let start = { x: 0, y: 0 }

  function startDrawLine() {
    canvas.addEventListener('mousedown', mousedownHandler)
  } 

  function stopDrawLine() {
    canvas.removeEventListener('mousedown', mousedownHandler)
  }

  function mousedownHandler(event: MouseEvent) {
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    const x = (event.clientX - rect.left) * ratio
    const y = (event.clientY - rect.top) * ratio
    start = { x, y }
  }

  function mousemoveHandler(event: MouseEvent) {
    const x = (event.clientX - rect.left) * ratio
    const y = (event.clientY - rect.top) * ratio

    const color = getColor()
    const lineWidth = getLineWidth()
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()

    start = { x, y }
  }

  function mouseupHandler(event: MouseEvent) {
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function getColor() {
    return toolsStore.penColor
  }

  function getLineWidth() {
    if(toolsStore.penSize === 'small')
      return 1
    else if(toolsStore.penSize ==='medium')
      return 3
    else if(toolsStore.penSize === 'large')
      return 5
    return 1
  }

  return {
    startDrawLine,
    stopDrawLine
  }
}
