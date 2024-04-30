import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'

export function useDrawRect(dom: HTMLElement, screenshot: HTMLCanvasElement, mode: Ref<'draw' | 'drag'>) {
  const img = ref('')
  let startflag = false
  let start = {
    x: 0,
    y: 0,
  }

  function startDraw() {
    document.addEventListener('mousedown', mousedownHanlder)
  }

  function mousedownHanlder(e: MouseEvent) {
    e.preventDefault()
    startflag = true
    start = {
      x: e.pageX,
      y: e.pageY,
    }
    console.log('start', start)
    dom.style.left = `${start.x}px`
    dom.style.top = `${start.y}px`
    document.addEventListener('mousemove', mousemoveHanlder)
    document.addEventListener('mouseup', mouseupHanlder)
  }

  function mousemoveHanlder(e: MouseEvent) {
    if (!startflag)
      return
    if (mode.value !== 'draw')
      return

    e.preventDefault()

    const { pageX, pageY } = e
    const width = pageX - start.x
    const height = pageY - start.y

    dom.style.width = `${width}px`
    dom.style.height = `${height}px`

    useCanvas({ x: start.x, y: start.y, height, width })
  }

  function mouseupHanlder(e: MouseEvent) {
    e.preventDefault()
    startflag = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
    stopDraw()
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

  function stopDraw() {
    document.removeEventListener('mousedown', mousedownHanlder)
    mode.value = 'drag'
  }

  return {
    startDraw,
    stopDraw,
    img,
  }
}
