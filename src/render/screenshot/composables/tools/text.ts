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
    undo.track()

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
    const color = getColor()
    const size = getSize()

    input = document.createElement('input')
    input.type = 'text'
    input.style.cssText = `
        position: fixed;
        left: ${left}px;
        top: ${top}px;
        border: none;
        outline: none;
        box-shadow: none;
        text-line-through: none;
        background-color: transparent;
        font-size: ${size}px;
        color: ${color};
        font-family: Arial, sans-serif;
        z-index: 9999;
    `

    document.body.appendChild(input)
    input.focus()

    input.addEventListener('blur', (e) => {
      textSvg.textContent = (e.target as HTMLInputElement).value
      textSvg.setAttribute('fill', `${color}`)
      textSvg.setAttribute('font-size', `${size}`)

      input.remove()
    })
  }

  function getColor() {
    return toolsStore.textColor
  }

  function getSize() {
    const size = toolsStore.textSize
    if(size === 'small') {
      return  12
    }
    if(size ==='medium') {
      return 16
    }
    if(size === 'large') {
      return 20
    }
    return 12
  }

  return {
    startWriteText,
    stopWriteText,
  }
}
