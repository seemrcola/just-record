export function useSaveScreenshot(screenshot: HTMLCanvasElement) {
  // 拿到图片的blob格式
  // 将canvas转换为Blob
  return new Promise((resolve, reject) => {
    screenshot.toBlob(function (blob) {
      // 使用Clipboard API写入剪贴板
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob as Blob
        })
      ])
      .then(function () {
        console.log('Image copied to clipboard');
        resolve(true);
      })
      .catch(function (error) {
        console.error('Error copying image to clipboard', error);
        reject(false);
      });
    }, 'image/png');
  })
}
