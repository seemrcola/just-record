export function useMosaic(canvas: HTMLCanvasElement) {
  const ratio = window.devicePixelRatio
  const mosaicRadius = 24
  // 获取到画布的rect
  const rect = canvas.getBoundingClientRect()
  // 拿到画布的上下文
  const ctx = canvas.getContext('2d')!
  // 定义一个函数，用于绘制马赛克
  function drawMosaic(point: { x: number, y: number }, size: number) {
    // 取出当前点周围半径为size的矩形
    const area = {
      x: Math.floor(point.x - size / 2),
      y: Math.floor(point.y - size / 2),
      width: size,
      height: size,
    }
    // 填充颜色
    const color = getMosaicColor(point, size)
    ctx.fillStyle = color
    // 绘制矩形
    ctx.fillRect(area.x, area.y, size, size)
  }

  function getMosaicColor(point: { x: number, y: number }, size: number) {
    // 计算出马赛克的颜色值
    // 获取正方形区域的像素数据
    const imageData = ctx.getImageData(point.x, point.y, size, size)
    const data = imageData.data

    let r = 0; let g = 0; let b = 0; let a = 0
    let pixelCount = size * size

    // 遍历正方形区域内的所有像素
    for (let i = 0; i < data.length; i += 4) {
      r += data[i] // 红色值
      g += data[i + 1] // 绿色值
      b += data[i + 2] // 蓝色值
      a += data[i + 3] // 透明度值
    }

    // 计算平均颜色值
    r = Math.round(r / pixelCount)
    g = Math.round(g / pixelCount)
    b = Math.round(b / pixelCount)
    a = Math.round(a / pixelCount)

    // 返回计算出的平均颜色值的 rgba 字符串
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`
  }

  function startMosaic() {
    canvas.addEventListener('mousedown', mousedownhanlder)
  }

  function stopMosaic() {
    canvas.removeEventListener('mousedown', mousedownhanlder)
    canvas.removeEventListener('mousemove', mousemovehanlder)
    canvas.removeEventListener('mouseup', mouseuphanlder)
  }

  function mousedownhanlder(event: MouseEvent) {
    canvas.addEventListener('mousemove', mousemovehanlder)
    canvas.addEventListener('mouseup', mouseuphanlder)
  }

  function mousemovehanlder(event: MouseEvent) {
    const { pageX, pageY } = event
    const x = (pageX - rect.left) * ratio
    const y = (pageY - rect.top) * ratio
    drawMosaic({ x, y }, mosaicRadius)
  }

  function mouseuphanlder() {
    stopMosaic()
  }

  return {
    startMosaic,
    stopMosaic,
  }
}
