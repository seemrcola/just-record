import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useText(canvas: HTMLCanvasElement, svg: SVGElement) {
    const toolsStore = useToolsStore()
    const undo = useUndo(canvas, svg)

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
        let textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textSvg?.remove()
        textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textSvg.setAttribute('x', x.toString())
        textSvg.setAttribute('y', y.toString())
        textSvg.setAttribute('style', 'user-select: none; pointer-events: none;')
        createInput(event.clientX, event.clientY, textSvg)
        // 将文本节点添加到svg中
        svg.appendChild(textSvg)
    }

    function createInput(left: number, top: number, textSvg: SVGTextContentElement) {
        const color = getColor()
        const size = getSize()

        const div = document.createElement('div')
        div.contentEditable = 'true'
        div.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      box-shadow: none;
      text-line-through: none;
      background-color: transparent;
      font-size: ${size}px;
      color: ${color};
      font-family: Arial, sans-serif;
      z-index: 9999;
    `

        document.body.appendChild(div)
        div.focus()

        div.addEventListener('blur', (e) => {
            const textContent = (e.target as HTMLDivElement).innerText
            // 去掉空格和换行符
            const t = textContent.replace(/\s+/g, ' ').replace(/[\n\r]/g, '')
            if (t === '') {
                // 空文本不保存
                textSvg.remove()
                div?.remove()
                // 撤销之前的操作
                undo.undo()
                return
            }

            textSvg.setAttribute('fill', `${color}`)
            textSvg.setAttribute('font-size', `${size}`)
            const splitText = textContent.split('\n')

            // 创建tspan元素
            const x = Number.parseFloat(textSvg.getAttribute('x') || '0')
            for (let i = 0; i < splitText.length; i++) {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
                tspan.setAttribute('x', `${x}`)
                tspan.setAttribute('dy', `${size * 1.2}px`)
                tspan.textContent = splitText[i]
                textSvg.appendChild(tspan)
            }

            textSvg.removeEventListener('click', mousedownHandler)

            div?.remove()
        })
    }

    function getColor() {
        return toolsStore.textColor
    }

    function getSize() {
        const size = toolsStore.textSize
        if (size === 'small')
            return 12

        if (size === 'medium')
            return 16

        if (size === 'large')
            return 20

        return 12
    }

    return {
        startWriteText,
        stopWriteText,
    }
}
