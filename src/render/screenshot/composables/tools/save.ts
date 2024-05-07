export function useSaveScreenshot(screenshot: HTMLCanvasElement, svg: SVGElement) {
  // 拿到图片的blob格式
  // 将canvas转换为Blob
  return new Promise((resolve, reject) => {
    screenshot.toBlob((blob) => {
      // 使用Clipboard API写入剪贴板
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob as Blob,
        }),
      ])
        .then(() => {
          console.log('Image copied to clipboard')
          resolve(true)
        })
        .catch((error) => {
          console.error('Error copying image to clipboard', error)
          reject(false)
        })
    }, 'image/png')
  })
}
