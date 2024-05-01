import type { Ref } from 'vue'
import { ref } from 'vue'
import { useCanvas } from './utils'

export function useDragRect(dom: HTMLElement, screenshot: HTMLCanvasElement, mode: Ref<'draw' | 'drag'>) {
  const img = ref('')
  let startFlag = false
  let start = { x: 0, y: 0 }

  function startDrag() {
    document.addEventListener('mousedown', mousedownHandler)
  }

  function mousedownHandler(e: MouseEvent) {
    startFlag = true
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    start = { x: e.pageX, y: e.pageY }
  }

  function mousemoveHandler(e: MouseEvent) {
    if (!startFlag)
      return
    if (mode.value !== 'drag')
      return

    const { pageX, pageY } = e
    const { x, y } = start
    const deltaX = pageX - x
    const deltaY = pageY - y

    const rect = dom.getBoundingClientRect()
    const newX = rect.x + deltaX
    const newY = rect.y + deltaY
    dom.style.left = `${newX}px`
    dom.style.top = `${newY}px`

    start = { x: pageX, y: pageY }

    useCanvas(screenshot,{ x: newX, y: newY, height: rect.height, width: rect.width })
  }

  function mouseupHandler(e: MouseEvent) {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function endDrag() {
    document.removeEventListener('mousedown', mousedownHandler)
    mode.value = 'draw'
  }

  return {
    startDrag,
    endDrag,
    img,
  }
}
