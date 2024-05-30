import type { Ref } from 'vue'
import { createApp, ref } from 'vue'
import Coord from '../components/Coord.vue'
import type { Mode } from '../types'
import { useScreenshotStore } from '../store'
import { useCanvas } from './utils'

export function useDrawRect(
  rectDOM: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<Mode>,
) {
  const startFlag = ref(false)
  let start = {
    x: 0,
    y: 0,
  }
  let coordComponent: ReturnType<typeof createApp> | null = null
  let coordBox: HTMLElement | null = null

  const store = useScreenshotStore()

  function startDraw() {
    document.addEventListener('mousedown', mousedownHanlder)
    drawCoord()
  }

  function mousedownHanlder(e: MouseEvent) {
    console.log('----------------mousedown')
    startFlag.value = true
    start = {
      x: e.pageX,
      y: e.pageY,
    }
    rectDOM.style.left = `${start.x}px`
    rectDOM.style.top = `${start.y}px`
    document.addEventListener('mousemove', mousemoveHanlder)
    document.addEventListener('mouseup', mouseupHanlder)
  }

  function mousemoveHanlder(e: MouseEvent) {
    if (!startFlag.value)
      return
    if (mode.value !== 'draw')
      return

    console.log('mousemove', '我是draw，我在执行')

    const { abs } = Math
    const { pageX, pageY } = e

    const width = abs(pageX - start.x)
    const height = abs(pageY - start.y)
    console.log(start.x, start.y, pageX, pageY)
    console.log('width', width, 'height', height)
    const x = Math.min(start.x, pageX)
    const y = Math.min(start.y, pageY)

    rectDOM.style.width = `${width}px`
    rectDOM.style.height = `${height}px`
    rectDOM.style.left = `${x}px`
    rectDOM.style.top = `${y}px`

    useCanvas(screenshot, { x, y, height, width }, store.imgID)
  }

  function mouseupHanlder(e: MouseEvent) {
    startFlag.value = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
    stopDraw()

    mode.value = 'init'
  }

  function stopDraw() {
    document.removeEventListener('mousedown', mousedownHanlder)
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
    clearComponent()
  }

  function drawCoord() {
    clearComponent()

    const app = createApp(Coord)
    coordBox = document.createElement('div')
    coordComponent = app
    app.mount(coordBox)
    document.body.appendChild(coordBox)
  }

  function clearComponent() {
    coordComponent?.unmount()
    coordComponent = null
    coordBox?.remove()
  }

  return {
    startDraw,
    stopDraw,
    startFlag,
  }
}
