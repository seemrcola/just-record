const KBPS = 1_000

interface MediaRecorderCallbacks {
  dataavailableCallback?: (data: Blob) => void
  stopCallback?: () => void
  startCallback?: () => void
}

export function useRecorder(
  sliceTime = 1000,
  {
    dataavailableCallback,
    stopCallback,
    startCallback,
  }: MediaRecorderCallbacks) {
  let mediaRecorder: MediaRecorder | null = null
  let displayStream: MediaStream | null = null
  let audioStream: MediaStream | null = null

  // 获取屏幕流id
  async function getScreenSource() {
    const source = await window.useRecord.getCaptureResource()
    return source
  }

  async function getDisplayMedia(sourceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // @ts-expect-error
        mandatory: {
          chromeMediaSource: 'desktop',
        },
      },
      video: {
        // @ts-expect-error
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
        },
      },
    })
    return stream
  }

  async function getAudioStream() {
    // mac 系统下，录制音频需要额外使用别的工具
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      return audioStream
    }
    catch (error) {
      return new MediaStream()
    }
  }

  async function getDisplayStream() {
    const source = await getScreenSource()
    const stream = await getDisplayMedia(source.id)

    /**************************** test  ****************************/
    // 创建一个video播放 用于测试流是否正常
    // const video = document.createElement('video')
    // video.srcObject = stream
    // video.autoplay = true
    // document.body.appendChild(video)
    // video.style.cssText = 'position: fixed; width: 400px; height: 300px;'
    /**************************** test *****************************/

    return stream
  }

  function combinedStream(videoStream: MediaStream, audioStream: MediaStream) {
    return new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()])
  }

  // 获取屏幕流
  async function startRecording(
    stream: MediaStream,
    options: MediaRecorderOptions = {
      mimeType: "video/webm;codecs=vp9,opus",
      videoBitsPerSecond: 2000 * KBPS,
      audioBitsPerSecond: 128 * KBPS,
    }) {
    // 先清空之前的资源
    clear()
    // 创建 MediaRecorder
    mediaRecorder = new MediaRecorder(stream, options)
    // 监听一些其它操作
    mediaRecorderListeners()
    // 开始录屏
    mediaRecorder.start(sliceTime)
  }

  function endRecording() {
    if (mediaRecorder?.state === 'recording')
      mediaRecorder?.stop()
  }

  function mediaRecorderListeners() {
    if (!mediaRecorder)
      return console.warn('mediaRecorder is not defined')
    // 数据可用监听
    mediaRecorder?.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) {
        dataavailableCallback?.(e.data)
      }
      console.log('data available ========>', e.data)
    })
    // 结束录屏监听
    mediaRecorder?.addEventListener('stop', () => {
      stopCallback?.()
      clear()
    })
    // 开始录屏监听
    mediaRecorder?.addEventListener('start', () => {
      startCallback?.()
    })
    // 错误监听
    mediaRecorder?.addEventListener('error', (e) => {
      console.error('media recorder error', e)
    })
  }

  function clear() {
    mediaRecorder?.stream.getTracks().forEach(track => track.stop())
    displayStream?.getTracks().forEach(track => track.stop())
    audioStream?.getTracks().forEach(track => track.stop())
  }

  return {
    mediaRecorder,
    startRecording,
    endRecording,
    getDisplayStream,
    getAudioStream,
    combinedStream,
    clear,
  }
}
