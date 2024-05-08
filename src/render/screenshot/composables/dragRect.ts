import type { Ref } from 'vue'
import type { Mode } from '../types'
import { useScreenshotStore } from '../store'
import { useCanvas } from './utils'

export function useDragRect(
  rectDOM: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<Mode>,
) {
  let startFlag = false
  let start = { x: 0, y: 0 }

  const store = useScreenshotStore()

  function startDrag() {
    rectDOM.addEventListener('mousedown', mousedownHandler)
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

    const rect = rectDOM.getBoundingClientRect()
    let newX = rect.x + deltaX
    let newY = rect.y + deltaY

    // 限制拖动范围
    newX = newX < 0 ? 0 : newX
    newY = newY < 0 ? 0 : newY
    newX = newX + rect.width > window.innerWidth ? window.innerWidth - rect.width : newX
    newY = newY + rect.height > window.innerHeight ? window.innerHeight - rect.height : newY

    // 改变位置
    rectDOM.style.left = `${newX}px`
    rectDOM.style.top = `${newY}px`

    start = { x: pageX, y: pageY }
    useCanvas(screenshot, { x: newX, y: newY, height: rect.height, width: rect.width }, store.imgID)
  }

  function mouseupHandler(e: MouseEvent) {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
  }

  function stopDrag() {
    document.removeEventListener('mousedown', mousedownHandler)
  }

  return {
    startDrag,
    stopDrag,
  }
}
