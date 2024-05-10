import { nextTick } from 'vue'
import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useText(canvas: HTMLCanvasElement, svg: SVGElement) {
  const toolsStore = useToolsStore()
  const undo = useUndo(canvas, svg)
  let textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  let input = document.createElement('input')

  const rect = canvas.getBoundingClientRect()

  function startWriteText() {
    svg.addEventListener('click', mousedownHandler)
  }

  function stopWriteText() {
    svg.removeEventListener('click', mousedownHandler)
  }

  function mousedownHandler(event: MouseEvent) {
    // 取消默认事件
    event.preventDefault()
    event.stopPropagation()
    const y = event.clientY - rect.top
    const x = event.clientX - rect.left
    // 创建一个文本节点
    textSvg?.remove()
    textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textSvg.setAttribute('x', x.toString())
    textSvg.setAttribute('y', y.toString())
    createInput(event.clientX, event.clientY)
    // 将文本节点添加到svg中
    svg.appendChild(textSvg)

    stopWriteText()
  }

  function createInput(left: number, top: number) {
    input = document.createElement('input')
    input.type = 'text'
    input.style.position = 'fixed'
    input.style.top = top + 'px'
    input.style.left = left + 'px'
    input.style.zIndex = '999'

    document.body.appendChild(input)
    input.focus()

    input.addEventListener('blur', (e) => {
      textSvg.textContent = (e.target as HTMLInputElement).value
      input.remove()
    })
  }

  return {
    startWriteText,
    stopWriteText,
  }
}
