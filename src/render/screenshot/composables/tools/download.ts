export function useDownload(canvas: HTMLCanvasElement) {
  const base64 = canvas.toDataURL()
  // 保存到本地
  const link = document.createElement('a')
  link.download = 'just-record.png'
  link.href = base64
  link.click()
  link.remove()
}
