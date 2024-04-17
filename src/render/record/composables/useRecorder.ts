import { db } from './db'

// 这个文件是用来实现录屏的功能的，主要是使用 MediaRecorder API 来实现录屏的功能。
const Kbps = 1000

export function useRecorder(sliceTime = 1000) {
  let mediaRecorder: MediaRecorder | null = null
  let displayStream: MediaStream | null = null
  let audioStream: MediaStream | null = null

  // 获取音频流
  async function getAudioStream() {
    // mac 系统下，录制音频需要额外使用别的工具 （但是在chrome插件里是可以做到录制麦克风音频的）
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      return audioStream
    }
    catch (error) {
      return new MediaStream()
    }
  }

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

  // 获取屏幕流
  async function startRecording(options: MediaRecorderOptions = {
    mimeType: 'video/webm; codecs=vp9',
    videoBitsPerSecond: 2000 * Kbps,
    audioBitsPerSecond: 128 * Kbps,
  }) {
    // 先清空之前的流
    clearBlobList()
    // 将音频流合进来
    const source = await getScreenSource()
    displayStream = await getDisplayMedia(source.id)
    audioStream = await getAudioStream()
    // 合并音视频流
    const combinedStream = new MediaStream([...displayStream.getTracks(), ...audioStream.getTracks()])
    // 创建 MediaRecorder
    mediaRecorder = new MediaRecorder(combinedStream, options)
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
      if (e.data.size > 0)
        db.recordData.add({ name: 'recordData', data: e.data })
      console.log('data available ========>', e.data)
    })
    // 结束录屏监听
    mediaRecorder?.addEventListener('stop', () => {
      clear()
    })
  }

  function clear() {
    mediaRecorder?.stream.getTracks().forEach(track => track.stop())
    displayStream?.getTracks().forEach(track => track.stop())
    audioStream?.getTracks().forEach(track => track.stop())
  }

  function getBlobList() {
    return db.recordData.toArray()
  }

  function clearBlobList() {
    db.recordData.clear()
  }

  function clearRecorder() {
    mediaRecorder = null
  }

  function clearAll() {
    clear()
    clearBlobList()
    clearRecorder()
  }

  return {
    mediaRecorder,
    startRecording,
    endRecording,
    clear,
    getBlobList,
    clearBlobList,
    clearRecorder,
    clearAll,
  }
}