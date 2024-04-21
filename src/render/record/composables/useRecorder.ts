/**
 * 当前bug记录，当调用mediaRecorder的start方法的时候，onstart并不会执行，反而是stop的时候onstart会执行
 */

const KBPS = 1_000

interface MediaRecorderCallbacks {
  dataavailableCallback?: (data: Blob) => void
  stopCallback?: () => void
  startCallback?: () => void
}

export function useRecorder(
  {
    dataavailableCallback,
    stopCallback,
    startCallback,
  }: MediaRecorderCallbacks,
) {
  let mediaRecorder: MediaRecorder | null = null
  const displayStream: MediaStream | null = null
  const audioStream: MediaStream | null = null

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

    /** ************************** test  */
    // 创建一个video播放 用于测试流是否正常
    // const video = document.createElement('video')
    // video.srcObject = stream
    // video.autoplay = true
    // document.body.appendChild(video)
    // video.style.cssText = 'position: fixed; left: 0; top: 0; width: 400px; height: 300px; z-index: 9999'
    /** ************************** test */

    return stream
  }

  function combinedStream(videoStream: MediaStream, audioStream: MediaStream) {
    return new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()])
  }

  // 获取屏幕流
  async function startRecording(
    stream: MediaStream,
    timeSlice: number = 1000,
    options: MediaRecorderOptions = {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: 2000 * KBPS,
      audioBitsPerSecond: 128 * KBPS,
    },
  ) {
    // 先清空之前的资源
    clear()
    // 创建新的资源
    mediaRecorder = generateMediaRecoder(stream, options)
    // 开始录屏
    // todo 倒计时页面
    await sleep(3000)
    mediaRecorder.start(timeSlice)
  }

  function endRecording() {
    mediaRecorder?.stop()
  }

  function generateMediaRecoder(stream: MediaStream, options: MediaRecorderOptions) {
    const mediaRecorder = new MediaRecorder(stream, options)
    console.log('media recorder options', mediaRecorder)
    // 数据可用监听
    mediaRecorder.ondataavailable = (e) => {
      console.log('media recorder data available', e.data) 
      if (e.data.size === 0) return
      dataavailableCallback?.(e.data)
    }
    // 结束录屏监听
    mediaRecorder.onstop = () => {
      console.log('media recorder stop')
      stopCallback?.()
      clear()
    }
    // 开始录屏监听
    mediaRecorder.onstart = () => {
      console.log('media recorder start')
      startCallback?.()
    }
    // 错误监听
    mediaRecorder.onerror = (e) => {
      console.log('media recorder error', e)
    }

    return mediaRecorder
  }

  function clear() {
    mediaRecorder?.stream.getTracks().forEach(track => track.stop())
    displayStream?.getTracks().forEach(track => track.stop())
    audioStream?.getTracks().forEach(track => track.stop())
  }

  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
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
