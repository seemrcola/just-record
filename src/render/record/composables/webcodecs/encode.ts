interface EncoderCallback {
  outputCallback: (encodedChunk: EncodedVideoChunk) => void;
  errorCallback: (error: DOMException) => void;
}

export function useEncodeVideo({
  outputCallback,
  errorCallback,
}: EncoderCallback) {
  const KEY_FRAME_INTERVAL = 150;
  let encoder: VideoEncoder | null = null;
  let reader: any = null;
  let shouldContinueEncoding = true; // 控制编码循环是否继续的标志

  async function generateVideoEncoder(configure: VideoEncoderConfig) {
    const encoder = new VideoEncoder({
      output: encodedChunk => outputCallback(encodedChunk),
      error: error => errorCallback(error),
    });

    encoder.configure(configure);
    return encoder;
  }

  async function generateTrackReader(stream: MediaStream) {
    const track = stream.getVideoTracks()[0];
    // @ts-expect-error
    const trackProcessor = new MediaStreamTrackProcessor(track);
    const reader = trackProcessor.readable.getReader();
    return reader;
  }

  async function encodeVideo(stream: MediaStream, configure: VideoEncoderConfig) {
    reader = await generateTrackReader(stream);
    encoder = await generateVideoEncoder(configure);

    let frameCount = 0;
    while (shouldContinueEncoding) {
      const frame = await reader.read();
      const { chunk, done } = frame;
      if (done) break;

      if (encoder.encodeQueueSize > 2) {
        frame.close();
      } else {
        frameCount++;
        const ifKeyframe = frameCount % KEY_FRAME_INTERVAL === 0;
        encoder.encode(chunk, { keyFrame: ifKeyframe });
        frame.close();
      }
    }

    encoder.flush();
    encoder.close();
    reader.releaseLock(); // 释放reader资源
  }

  function stopEncoding() {
    shouldContinueEncoding = false; // 设置标志以停止编码循环
    reader.stop(); // 取消reader读取
  }

  return {
    encodeVideo,
    stopEncoding,
  }
}
