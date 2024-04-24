<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useDialog } from 'naive-ui'
import { useSvgRegion } from './composables'

let encodeWorker: Worker | undefined
let stream = new MediaStream()

// 这里需要大改，将大部分功能迁移到web侧
// 逻辑需要改为先进行文件选择，在进行录制以及写入文件
// 录制结束之后 文件就已经生成并处理好 此时可以选择预览文件

const dialog = useDialog()
let rectOptions: RecordOptions

onMounted(() => {
  init()
})

function init() {
  const { start } = useSvgRegion(
    '#the_mask_wrapper',
    {
      winOnShow: () => { /** todo 可能会需要有什么操作 */ },
      winOnHide: () => window.useRecord.hide(),
      onStartRecord: async (recordOptions: RecordOptions) => {
        rectOptions = recordOptions
      },
      onStopRecord: (callback: () => void) => {
        window.useRecord.onStopRecord(async () => {
          callback()
          clear()
          // replay()
        })
      },
      onStartRecordSuccess: async () => {
        stream = await getDisplayStream()
        if (rectOptions.fullScreen) {
          // 创建一个文件 用于处理webm流
          try {
            await generateWebmFile(stream)
          }
          catch (error) {
            return
          }
        }
        else {
          // todo
        }
        window.useRecord.start(rectOptions) // 通知主进程 让主进程通知所有窗口更新状态
      },
      onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
      onStartFullRecordSuccess: () => window.useRecord.hide(),
    },
  )
  start()
}

async function generateWebmFile(stream: MediaStream) {
  /**
   * 这个是用来保存文件的，可以用于创建一个文件
   * 下面这个就是标准用法
   * 文档链接 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showSaveFilePicker
   */
  // @ts-expect-error
  const handle = await window.showSaveFilePicker({
    startIn: 'desktop', // 选择器的初始位置 ['window', 'filesystem', 'downloads', 'desktop', 'videos']
    suggestedName: 'record.webm', // 建议的文件名
    types: [{
      description: 'Video File', // 描述
      accept: { 'video/webm': ['.webm'] }, // 接受的类型
    }],
  })
  // 获取到视频轨道
  const videoTrack = stream.getVideoTracks()[0]
  console.log(videoTrack, 'videoTrack')
  // 获取到视频轨道的设置
  const trackSettings = videoTrack.getSettings()
  /**
   * 这个是用来获取视频轨道的帧数据的，可以用来处理视频帧
   * 下面这个就是标准用法
   * 文档链接 https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrackProcessor
   */
  // @ts-expect-error
  const trackProcessor = new MediaStreamTrackProcessor(videoTrack)
  // 获取到视频轨道的帧数据流 一个ReadableStream
  const frameStream = trackProcessor.readable
  const url = new URL('./composables/webcodecs/encode-worker.js', import.meta.url)
  encodeWorker = new Worker(url, { type: 'module' })

  // webworker 的 postMessage 方法可以传递多个参数，第二个参数是数组，表示这些参数是共享ArrayBuffer
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/postMessage
  encodeWorker.postMessage({
    type: 'start',
    fileHandle: handle,
    frameStream,
    trackSettings,
  }, [frameStream])
}

async function getDisplayStream() {
  const source = await window.useRecord.getCaptureResource()
  return await navigator.mediaDevices.getUserMedia({
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
        chromeMediaSourceId: source.id,
      },
    },
  })
}

async function replay() {
  dialog.warning({
    title: '🔔提示',
    content: '录屏文件已保',
    positiveText: '预览',
    negativeText: '关闭',
    onPositiveClick: () => {
      setTimeout(() => {
        window.useRecord.hide()
      }, 500)
    },
    onNegativeClick: () => {
      setTimeout(() => {
        window.useRecord.hide()
      }, 500)
    },
  })
}

async function clear() {
  if (encodeWorker) {
    encodeWorker.terminate()
    encodeWorker = undefined
  }
  if (stream)
    stream.getTracks().forEach(track => track?.stop())
}

window.useRecord.onRecordShow(async () => {})
window.useRecord.onRecordHide(async () => {})

onUnmounted(() => {
  clear()
})
</script>

<template>
  <div id="the_mask_wrapper" w-full h-full flex-center class="mask">
    <!-- svg -->
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  overflow: hidden;
  background: transparent;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
