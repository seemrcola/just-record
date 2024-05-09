import { useHistoryStore } from '../../store'

export function useUndo(screenshot: HTMLCanvasElement, svg: SVGElement) {
  const ctx = screenshot.getContext('2d')!
  const { width, height } = screenshot

  const historyStore = useHistoryStore()

  function track(type: 'canvas' | 'svg' | 'both' = 'both') {
    if (type === 'canvas') {
      const dataUrl = screenshot.toDataURL()
      historyStore.history.push({ canvas: dataUrl })
    }
    if (type === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg)
      historyStore.history.push({ svg: svgData })
    }
    if (type === 'both') {
      const dataUrl = screenshot.toDataURL()
      const svgData = new XMLSerializer().serializeToString(svg)
      historyStore.history.push({ canvas: dataUrl, svg: svgData })
    }
  }

  function undo() {
    const top = historyStore.history.top as any
    if (!top)
      return
    
    historyStore.history.pop()
    if (top.canvas) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = top.canvas
    }

    if (top.svg) {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(top.svg, 'image/svg+xml')
      svg.innerHTML = xmlDoc.documentElement.innerHTML
    }
  }

  return {
    track,
    undo,
  }
}
