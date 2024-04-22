interface EncoderCallback {
  outputCallback: (encodedChunk: EncodedVideoChunk) => void
  errorCallback: (error: DOMException) => void
}

export function useEncodeVideo({
  outputCallback,
  errorCallback,
}: EncoderCallback) {
  const KEY_FRAME_INTERVAL = 150
  let encoder: VideoEncoder | null = null
  let reader: any = null
  let encodeState = true

  async function generateVideoEncoder(configure: VideoEncoderConfig) {
    const encoder = new VideoEncoder({
      output: encodedChunk => outputCallback(encodedChunk),
      error: error => errorCallback(error),
    })

    encoder.configure(configure)
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
    encodeState = true

    reader = await generateTrackReader(stream)
    encoder = await generateVideoEncoder(configure)

    let frameCount = 0
    while (true && encodeState) {
      const { value: frame, done } = await reader.read()
      if (done)
        break
      Promise.resolve().then(() => {
        if (encoder!.encodeQueueSize > 2) {
          frame.close()
        }
        else {
          frameCount++
          const ifKeyframe = frameCount % KEY_FRAME_INTERVAL === 0
          console.log(frame, 'frame')
          encoder!.encode(frame, { keyFrame: ifKeyframe })
          frame.close()
        }
      })
    }

    encoder.flush()
    encoder.close()
  }

  function stopEncoding() {
    encodeState = false
  }

  return {
    encodeVideo,
    stopEncoding,
  }
}
