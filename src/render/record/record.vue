<script setup lang="ts">
import { onMounted } from 'vue'
import { useDialog } from 'naive-ui'
import { db, useRecorder, useSvgRegion, utils } from './composables'

const dialog = useDialog()
let rectOptions: RecordOptions

const recorder = useRecorder({
  startCallback: () => { },
  stopCallback: () => { },
  dataavailableCallback: data => db.addRecord('record-data', data),
})

onMounted(() => {
  init()
})

function init() {
  const { start } = useSvgRegion(
    '#the_mask_wrapper',
    {
      // 当窗口展示的时候
      winOnShow: () => { /** todo 可能会需要有什么操作 */ },
      // 当窗口隐藏的时候 我们需要隐藏录屏窗口
      winOnHide: () => window.useRecord.hide(),
      // 当点击按钮录制的时候 调用 useRecord.startRecord 方法
      onStartRecord: async (recordOptions: RecordOptions) => {
        rectOptions = recordOptions          // 保存录制参数
        await db.deleteRecord('record-data') // 清空之前的录制数据
      },
      // 当点击停止录制的时候 调用 useRecord.stopRecord 方法
      onStopRecord: (callback: () => void) => {
        window.useRecord.onStopRecord(async () => {
          // 这个callback是这个hooks用来处理内部的一些逻辑 需要手动调用
          callback()
          // 停止录制
          await recorder.endRecording()
          // 处理录制文件
          if (!rectOptions.fullScreen)
            clipFile()
          else
            saveFile()
        })
      },
      // 当成功开始录制之后 我们需要更新图标 需要通知给圆形摄像头窗口和工具箱窗口 这个相当于是成功之后的通用回调（可以做一些成功之后的公共逻辑）
      onStartRecordSuccess: async () => {
        const displayStream = await getDisplayStream()
        await recorder.startRecording(displayStream) // 开始录制
        await window.useRecord.start(rectOptions)    // 通知主进程 让主进程通知所有窗口更新状态
      },
      // 当成功开始录制裁剪窗口之后 我们需要隐藏录屏窗口 这个相当于是裁剪录制的专属回调
      onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
      // 当成功开始录制全屏窗口之后 我们需要隐藏录屏窗口并显示透明的裁剪窗口 这个相当于是全屏录制的专属回调
      onStartFullRecordSuccess: () => window.useRecord.hide(),
    },
  )
  start()
}

// !! bug:这里记一个bug 必须要延迟一段时间才能够成功调用recorder.startRecording(displayStream)
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

async function saveFile() {
  // 通知主进程保存文件(主进程弹框)
  const result = await window.useRecord.saveFile()
  if (result.filePath) {
    // 取出文件
    const recordData = await db.getAllRecord('record-data')
    // 处理成一个buffer unit8array
    const mergedBuffer = await utils.toUnit8Array(recordData)
    // 通知主进程进行下载
    const res = await window.useRecord.downloadFile(result.filePath, mergedBuffer)
    if (res) {
      dialog.warning({
        title: '🔔提示',
        content: '录屏文件已保 是否进行预览',
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
    else {
      window.useRecord.hide()
    }
  }
  else {
    window.useRecord.hide()
  }
}

async function clipFile() {

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
