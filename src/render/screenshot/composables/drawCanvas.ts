interface Options {
  width: number
  height: number
  x: number
  y: number
}

export function useDrawCanvas(
  dom: HTMLImageElement,
  options: Options,
) {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height

  const ctx = canvas.getContext('2d')!
  // 绘制进画布
  ctx.drawImage(
    dom,
    options.x,
    options.y,
    options.width,
    options.height,
    0,
    0,
    options.width,
    options.height,
  )
  // 返回base64
  const base64 = canvas.toDataURL()
  // 销毁画布
  canvas.remove()
  return base64
}
