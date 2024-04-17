import { ref } from 'vue'

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export function useVideoProcessor() {
  const outputData = ref(new Uint8Array())

  // 解码、裁剪并转换视频数据
  async function processVideo(videoData: Uint8Array, cropRect: CropRect, codecConfig: any) {
    const decoder = new VideoDecoder({
      output: frame => processFrame(frame, cropRect),
      error: e => console.error('视频解码错误:', e),
    })

    decoder.configure(codecConfig)

    const chunk = new EncodedVideoChunk({
      type: 'key', // 根据视频帧类型调整，可能是'key'或'delta'
      timestamp: 0,
      data: videoData,
    })

    await decoder.decode(chunk)
    await decoder.flush()
    decoder.close()
  }

  // 处理解码后的视频帧
  function processFrame(frame: VideoFrame, { x, y, width, height }: CropRect) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // 将视频帧绘制到Canvas上，并进行裁剪
    // 这一帧是一个ImageBitmap对象，可以直接绘制到Canvas上
    ctx.drawImage(frame, x, y, width, height, 0, 0, width, height)

    frame.close() // 关闭帧以释放资源

    const imageData = ctx.getImageData(0, 0, width, height)
    const uint8ClampedArray = imageData.data // 这是一个Uint8ClampedArray

    // 转换为Uint8Array
    const uint8Array = new Uint8Array(uint8ClampedArray.buffer)

    outputData.value = uint8Array // 将处理后的数据保存到响应式变量
  }

  return {
    outputData,
    processVideo,
  }
}
