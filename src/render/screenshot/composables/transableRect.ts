import { Ref } from 'vue'
import { Position } from './types'
import { useCanvas } from './utils'

export function useTransable(
  rectDOM: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<'drag' | 'draw' | 'transable'>,
  pos: Ref<Position>
) {

  let startFlag = false
  let dragMode: 'corner' | 'side' = 'corner'
  let peerPoint = { x: 0, y: 0 }
  let start = { x: 0, y: 0 }
  let rect: DOMRect

  const corner = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  const side = ['top', 'bottom', 'left', 'right']

  function startTransable(event: MouseEvent) {
    startFlag = true
    start.x = event.pageX
    start.y = event.pageY
    document.addEventListener('mousemove', mousemoveHanlder)
    document.addEventListener('mouseup', mouseupHanlder)

    if (corner.includes(pos.value)) dragMode = 'corner'
    if (side.includes(pos.value)) dragMode = 'side'

    rect = rectDOM.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    // 计算对角点坐标
    peerPoint = {
      x: 2 * center.x - start.x,
      y: 2 * center.y - start.y
    }
  }

  function mousemoveHanlder(event: MouseEvent) {
    if (!startFlag) return
    if (mode.value !== 'transable') return
    const { pageX, pageY } = event

    if (dragMode === 'corner') handleConrer({ x: pageX, y: pageY })
    if (dragMode === 'side') handleSide({ x: pageX, y: pageY })
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

    useCanvas(screenshot, { x: posx, y: posy, width, height })
  }

  function handleSide(end: { x: number, y: number }) {
    const { x, y } = end
    const { abs } = Math

    const width = abs(x - peerPoint.x)
    const height = abs(y - peerPoint.y)

    // 左右只改变宽度
    if (pos.value === 'right') {
      rectDOM.style.width = `${width}px`
      useCanvas(screenshot, { x: rect.left, y: rect.top, width, height: rect.height })
    }
    if (pos.value === 'left') {
      rectDOM.style.left = `${x}px`
      rectDOM.style.width = `${width}px`
      useCanvas(screenshot, { x: x, y: rect.top, width, height: rect.height })
    }
    // 上下只改变高度
    if (pos.value === 'bottom') {
      rectDOM.style.height = `${height}px`
      useCanvas(screenshot, { x: rect.left, y: rect.top, width: rect.width, height })
    }
    if (pos.value === 'top') {
      rectDOM.style.top = `${y}px`
      rectDOM.style.height = `${height}px`
      useCanvas(screenshot, { x: rect.left, y: y, width: rect.width, height })
    }
  }

  function mouseupHanlder() {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
    mode.value = 'drag'
  }

  return {
    startTransable,
  }
}
