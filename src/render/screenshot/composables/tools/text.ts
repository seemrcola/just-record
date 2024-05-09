import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useText(canvas: HTMLCanvasElement, svg: SVGElement) {
  const toolsStore = useToolsStore()
  const undo = useUndo(canvas, svg)
  let textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')

  const rect = canvas.getBoundingClientRect()

  function startWriteText() {
    svg.addEventListener('mousedown', mousedownHandler)
  }

  function stopWriteText() {
    svg.removeEventListener('mousedown', mousedownHandler)
  }

  function mousedownHandler(event: MouseEvent) {
    // 取消默认事件
    event.preventDefault()
    event.stopPropagation()
    // 创建一个文本节点
    textSvg?.remove()
    textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textSvg.setAttribute('x', (event.clientX - rect.left).toString())
    textSvg.setAttribute('y', (event.clientY - rect.top).toString())

    // 给文本节点增加内容
    textSvg.textContent = 'Hello, World!'

    // 将文本节点添加到svg中
    svg.appendChild(textSvg)
  }

  return {
    startWriteText,
    stopWriteText,
  }
}
