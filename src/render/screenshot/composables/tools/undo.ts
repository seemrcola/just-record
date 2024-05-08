class Stack {
  private stack: any[] = []
  push(item: any) {
    this.stack.push(item)
  }

  pop() {
    if (this.isEmpty())
      return null
    return this.stack.pop()
  }

  get length() {
    return this.stack.length
  }

  isEmpty() {
    return this.stack.length === 0
  }

  get top() {
    if (this.isEmpty())
      return null
    const len = this.stack.length
    return this.stack[len - 1]
  }

  clear() {
    this.stack = []
  }
}

const stack = new Stack()

export function useUndo(screenshot: HTMLCanvasElement, svg: SVGElement) {
  const ctx = screenshot.getContext('2d')!
  const { width, height } = screenshot

  function track(type: 'canvas' | 'svg' | 'both' = 'both') {
    if (type === 'canvas') {
      const dataUrl = screenshot.toDataURL()
      stack.push({ canvas: dataUrl })
    }
    if (type === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg)
      stack.push({ svg: svgData })
    }
    if (type === 'both') {
      const dataUrl = screenshot.toDataURL()
      const svgData = new XMLSerializer().serializeToString(svg)
      stack.push({ canvas: dataUrl, svg: svgData })
    }
  }

  function undo() {
    const top = stack.top as any
    if (!top)
      return
    
    stack.pop()
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
    stack,
  }
}
