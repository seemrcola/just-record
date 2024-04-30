import type { Ref } from 'vue'
import { ref, nextTick } from 'vue'

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

    useCanvas({x: newX, y: newY, height: rect.height, width: rect.width})
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

  async function useCanvas({ x, y, height, width }: { x: number, y: number, height: number, width: number }) {
    // 将画布的这部分绘制到canvas
    const scale = window.devicePixelRatio
    const ctx = screenshot.getContext('2d')!
    screenshot.width = width * scale
    screenshot.height = height * scale
    await nextTick()
    // 获取图片
    const img = document.querySelector('#background-image-screenshot') as HTMLImageElement
    ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale, 0, 0, width , height)
    // 设置宽高位置
    screenshot.style.left = `${x}px`
    screenshot.style.top = `${y}px`
  }

  return {
    startDrag,
    endDrag,
    img,
  }
}
