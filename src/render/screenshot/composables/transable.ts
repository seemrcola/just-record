import { Ref } from 'vue'
import { Position } from './types'

export function useTransable(
  dom: HTMLElement,
  screenshot: HTMLCanvasElement,
  mode: Ref<'drag' | 'draw' | 'transable'>,
  pos: Ref<Position>
) {

  let startFlag = false
  let start = { x: 0, y: 0 }

  function startTransable() { 
    document.addEventListener('mousedown', mousedownHanlder)
  }

  function mousedownHanlder(event: MouseEvent) {
    startFlag = true
    start.x = event.clientX
    start.y = event.clientY
    document.addEventListener('mousemove', mousemoveHanlder)
    document.addEventListener('mouseup', mouseupHanlder)
  }

  function mousemoveHanlder(event: MouseEvent) {
    if (!startFlag) return 
    if(mode.value !== 'transable') return
    const { pageX, pageY } = event
  }

  function mouseupHanlder() {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHanlder)
    document.removeEventListener('mouseup', mouseupHanlder)
  }

  function stopTransable() {
    document.removeEventListener('mousedown', mousedownHanlder)
  }

  return {
    startTransable,
  }
}
