export function useSaveScreenshot(screenshot: HTMLCanvasElement, svg: SVGElement) {
  const ctx = screenshot.getContext('2d')!

  function save() {
    return new Promise((resolve, reject) => {
      // 获取svg内容
      const xml = new XMLSerializer().serializeToString(svg)
      const svgUrl = `data:image/svg+xml;base64,${btoa(xml)}`
      const img = new Image()
      img.src = svgUrl
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        saveCanvasAsPng(resolve, reject)
      }
    })
  }

  function saveCanvasAsPng(resolve: (value: boolean) => void, reject: (reason: any) => void) {
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
  }

  return {
    save,
  }
}
