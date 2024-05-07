export function useDownload(canvas: HTMLCanvasElement, svg: SVGElement) {
  const ctx = canvas.getContext('2d')!

  // 获取svg内容
  const xml = new XMLSerializer().serializeToString(svg)
  const svgUrl = `data:image/svg+xml;base64,${btoa(xml)}`
  const img = new Image()
  img.src = svgUrl
  img.onload = () => {
    ctx.drawImage(img, 0, 0)

    const base64 = canvas.toDataURL()
    // 保存到本地
    const link = document.createElement('a')
    link.download = 'just-record.png'
    link.href = base64
    link.click()
    link.remove()
  }
}
