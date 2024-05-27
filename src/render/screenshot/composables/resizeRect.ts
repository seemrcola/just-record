import type { Ref } from 'vue'
import { ref } from 'vue'
import type { Mode, Position } from '../types'
import { useScreenshotStore } from '../store'
import { useCanvas } from './utils'

export function useResizeRect(
  rectDOM: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<Mode>,
) {
  const startFlag = ref(false)
  let dragMode: 'corner' | 'side' = 'corner'
  let pos: Position = 'left'
  let peerPoint = { x: 0, y: 0 }
  const start = { x: 0, y: 0 }
  let rect: DOMRect

  const store = useScreenshotStore()

  const corner = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  const side = ['top', 'bottom', 'left', 'right']

  function startResize(event: MouseEvent, position: Position) {
    startFlag.value = true
    pos = position
    start.x = event.pageX
    start.y = event.pageY
    document.addEventListener('mousemove', mousemoveHanlder)
    document.addEventListener('mouseup', mouseupHanlder)

    if (corner.includes(pos))
      dragMode = 'corner'
    if (side.includes(pos))
      dragMode = 'side'

    rect = rectDOM.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    // 计算对角点坐标
    peerPoint = {
      x: 2 * center.x - start.x,
      y: 2 * center.y - start.y,
    }
  }

  function mousemoveHanlder(event: MouseEvent) {
    if (!startFlag.value)
      return
    if (mode.value !== 'resize')
      return
    const { pageX, pageY } = event

    console.log(pos, dragMode, '我是resize， 我在执行')

    if (dragMode === 'corner')
      handleConrer({ x: pageX, y: pageY })
    if (dragMode === 'side')
      handleSide({ x: pageX, y: pageY })
  }

  function handleConrer(end: { x: number, y: number }) {
    const { x, y } = end
    const { abs } = Math

    const width = abs(x - peerPoint.x)
    const height = abs(y - peerPoint.y)
    const posx = x < peerPoint.x ? x : peerPoint.x
    const posy = y < peerPoint.y ? y : peerPoint.y
    rectDOM.style.width = `${width}px`
    rectDOM.style.height = `${height}px`
    rectDOM.style.left = `${posx}px`
    rectDOM.style.top = `${posy}px`

    useCanvas(screenshot, { x: posx, y: posy, width, height }, store.imgID)
  }

  function handleSide(end: { x: number, y: number }) {
    const { x, y } = end
    const { abs, min, max } = Math

    const width = abs(x - peerPoint.x)
    const height = abs(y - peerPoint.y)

    // 左右只改变宽度
    if (pos === 'right') {
      const newX = min(rect.left, x)
      rectDOM.style.width = `${width}px`
      rectDOM.style.left = `${newX}px`
      useCanvas(screenshot, { x: newX, y: rect.top, width, height: rect.height }, store.imgID)
    }
    if (pos === 'left') {
      const newX = min(rect.left + rect.width, x)
      rectDOM.style.left = `${newX}px`
      rectDOM.style.width = `${width}px`
      useCanvas(screenshot, { x: newX, y: rect.top, width, height: rect.height }, store.imgID)
    }
    // 上下只改变高度
    if (pos === 'bottom') {
      const newY = min(rect.top, y)
      rectDOM.style.height = `${height}px`
      rectDOM.style.top = `${newY}px`
      useCanvas(screenshot, { x: rect.left, y: newY, width: rect.width, height }, store.imgID)
    }
    if (pos === 'top') {
      const newY = min(rect.top + rect.height, y)
      rectDOM.style.top = `${newY}px`
      rectDOM.style.height = `${height}px`
      useCanvas(screenshot, { x: rect.left, y: newY, width: rect.width, height }, store.imgID)
    }
  }

  function mouseupHanlder() {
    startFlag.value = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)

    mode.value = 'init'
  }

  function stopResize() {
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
  }

  return {
    startResize,
    stopResize,
    startFlag,
  }
}
