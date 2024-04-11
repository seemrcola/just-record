<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NDialogProvider } from 'naive-ui'
import { useSvgRegion } from './composables/useSvgRegion'
import { useRecorder } from './composables/useRecorder'

const recorder = useRecorder()

onMounted(() => {
  init()
})

function init() {
  const { start } = useSvgRegion(
    '#the_mask_wrapper',
    {
      // 当窗口展示的时候
      winOnShow: () => { },
      // 当窗口隐藏的时候 我们需要隐藏录屏窗口
      winOnHide: () => window.useRecord.hide(),
      // 当点击按钮录制的时候 调用 useRecord.startRecord 方法
      onStartRecord: (recordOptions: RecordOptions) => {
        recorder.startRecording()
        return window.useRecord.start(recordOptions)
      },
      // 当点击停止录制的时候 调用 useRecord.stopRecord 方法
      onStopRecord: (callback: () => void) => {
        window.useRecord.onStopRecord((msg) => {
          // 这个callback是这个hooks用来处理内部的一些逻辑 需要手动调用
          callback()
          // 这部分就是用户自己的逻辑
          recorder.saveFile() // 保存文件
          window.useRecord.hide() // 隐藏录屏窗口
        })
      },
      // 当成功开始录制之后 我们需要更新图标 需要通知给圆形摄像头窗口和工具箱窗口
      onStartRecordSuccess: () => {
        return window.useRecord.message({ type: 'change-icon', msg: true })
      },
      // 当成功开始录制裁剪窗口之后 我们需要隐藏录屏窗口
      onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
      // 当成功开始录制全屏窗口之后 我们需要隐藏录屏窗口并显示透明的裁剪窗口
      onStartFullRecordSuccess: () => window.useRecord.hide(),
    },
  )
  start()
}

window.useRecord.onRecordShow(async () => {

})
window.useRecord.onRecordHide(async () => {

})
</script>

<template>
  <NDialogProvider>
    <div id="the_mask_wrapper" w-full h-full flex-center class="mask">
      <!-- svg -->
    </div>
  </NDialogProvider>
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
