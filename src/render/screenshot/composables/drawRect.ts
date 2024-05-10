import type { Ref } from 'vue'
import { createApp } from 'vue'
import Coord from '../components/Coord.vue'
import type { Mode } from '../types'
import { useScreenshotStore } from '../store'
import { useCanvas } from './utils'

export function useDrawRect(
  rectDOM: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<Mode>,
) {
  let startFlag = false
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
    
    startFlag = true
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
    if (!startFlag)
      return
    if (mode.value !== 'draw')
      return

    

    const { abs } = Math
    const { pageX, pageY } = e

    const width = abs(pageX - start.x)
    const height = abs(pageY - start.y)
    const x = Math.min(start.x, pageX)
    const y = Math.min(start.y, pageY)

    rectDOM.style.width = `${width}px`
    rectDOM.style.height = `${height}px`
    rectDOM.style.left = `${x}px`
    rectDOM.style.top = `${y}px`

    useCanvas(screenshot, { x, y, height, width }, store.imgID)
  }

  function mouseupHanlder(e: MouseEvent) {
    
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
    stopDraw()
  }

  function stopDraw() {
    document.removeEventListener('mousedown', mousedownHanlder)
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
  }
}
