import { useToolsStore } from '../../store'
import { useUndo } from './undo'

export function useText(canvas: HTMLCanvasElement, svg: SVGElement) {
  const toolsStore = useToolsStore()
  const undo = useUndo(canvas, svg)


}
