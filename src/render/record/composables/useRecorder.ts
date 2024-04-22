import Countdown from '../components/Countdown.vue'
import { createApp } from 'vue' 

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

  function combinedStream(...streams: MediaStream[]) {
    const combined = new MediaStream()
    streams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        combined.addTrack(track)
      })
    })
    return combined
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
    // 倒计时
    await countdonw()
    // 开始录屏
    mediaRecorder.start(timeSlice)
  }

  function endRecording() {
    mediaRecorder?.stop()
  }

  function generateMediaRecoder(stream: MediaStream, options: MediaRecorderOptions) {
    const mediaRecorder = new MediaRecorder(stream, options)
    // 数据可用监听
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size === 0)
        return
      dataavailableCallback?.(e.data)
    }
    // 结束录屏监听
    mediaRecorder.onstop = () => {
      stopCallback?.()
      clear()
    }
    // 开始录屏监听
    mediaRecorder.onstart = () => {
      startCallback?.()
    }
    // 错误监听
    mediaRecorder.onerror = (e) => {
      console.log('media recorder error', e)
    }

    return mediaRecorder
  }

  async function countdonw() {
    return new Promise((resolve) => {
      const app = createApp(Countdown)
      const fragment = document.createDocumentFragment()
      app.mount(fragment as any)
      document.body.appendChild(fragment)
  
      setTimeout(() => {
        resolve(true)
        app.unmount()
      }, 5000)
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
    combinedStream,
    clear,
  }
}
