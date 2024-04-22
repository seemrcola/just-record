<script setup lang="ts">
import { onMounted } from 'vue'
import { useDialog } from 'naive-ui'
import { db, useEncodeVideo, useSvgRegion } from './composables'

// 这里需要大改，将大部分功能迁移到web侧 
// 逻辑需要改为先进行文件选择，在进行录制以及写入文件
// 录制结束之后 文件就已经生成并处理好 此时可以选择预览文件

const dialog = useDialog()
let rectOptions: RecordOptions

const encoder = useEncodeVideo({
  outputCallback: data => saveChunk(data, rectOptions),
  errorCallback: error => console.error(error),
})

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
        await db.deleteRecord('record-data')
      },
      onStopRecord: (callback: () => void) => {
        window.useRecord.onStopRecord(async () => {
          encoder.stopEncoding()
          saveFile()
          callback()
        })
      },
      onStartRecordSuccess: async () => {
        const displayStream = await getDisplayStream()
        if (rectOptions.fullScreen) {
          const height = window.screen.height
          const width = window.screen.width
          encoder.encodeVideo(displayStream, {
            width,
            height,
            codec: 'vp8',
          })
        }
        window.useRecord.start(rectOptions) // 通知主进程 让主进程通知所有窗口更新状态
      },
      onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
      onStartFullRecordSuccess: () => window.useRecord.hide(),
    },
  )
  start()
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

async function saveChunk(chunk: EncodedVideoChunk, options: RecordOptions) {
  const chunkData = new Uint8Array(chunk.byteLength)
  chunk.copyTo(chunkData)
  await db.addRecord('record-data', chunkData)
}

async function getChunkData() {
  const recordData = await db.getAllRecord('record-data')
  const uint8Arrays = recordData.map(item => new Uint8Array(item.data))
  // 合并uint8Arrays
  const mergedUint8Array = new Uint8Array(uint8Arrays.reduce((acc, cur) => acc + cur.length, 0))
  let offset = 0
  for (const uint8Array of uint8Arrays) {
    mergedUint8Array.set(uint8Array, offset)
    offset += uint8Array.length
  }
  return mergedUint8Array
}

async function saveFile() {
  // 通知主进程保存文件(主进程弹框)
  const result = await window.useRecord.saveFile()

  if (!result.filePath)
    window.useRecord.hide()
  // 合并保存文件
  const mergedUint8Array = await getChunkData()
  const res = await window.useRecord.downloadFile(result.filePath, mergedUint8Array)
  // 下载文件失败
  if (!res)
    window.useRecord.hide()

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

window.useRecord.onRecordShow(async () => {})
window.useRecord.onRecordHide(async () => {})
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
