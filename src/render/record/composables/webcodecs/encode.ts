export async function useEncodeVideo() {
  const KEY_FRAME_INTERVAL = 150

  async function generateVideoEncoder(configure: VideoEncoderConfig) {
    // 创建编码器
    const encoder = new VideoEncoder({
      output: encodedChunk => console.log(encodedChunk),
      error: error => console.error(error),
    })

    // 配置编码器
    encoder.configure(configure)
    // 返回编码器
    return encoder
  }

  async function generateTrackReader(stream: MediaStream) {
    const track = stream.getVideoTracks()[0]
    // @ts-expect-error
    const trackProcessor = new MediaStreamTrackProcessor(track)
    const reader = trackProcessor.readable.getReader()
    return reader
  }

  async function encodeVideo(stream: MediaStream, configure: VideoEncoderConfig) {
    const reader = await generateTrackReader(stream)
    const encoder = await generateVideoEncoder(configure)

    let frameCount = 0
    while (true) {
      const frame = await reader.read()
      const { chunk, done } = frame
      if (done)
        break

      if (encoder.encodeQueueSize > 2) {
        frame.close()
      }
      else {
        frameCount++
        const ifKeyframe = frameCount % KEY_FRAME_INTERVAL === 0
        encoder.encode(chunk, { keyFrame: ifKeyframe })
        frame.close()
      }
    }
    encoder.flush()
    encoder.close()
  }

  return {
    encodeVideo,
  }
}
