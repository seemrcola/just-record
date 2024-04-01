<script setup lang="ts">
import { onMounted } from 'vue'
import { useSvgRegion } from './composables/useSvgRegion'

onMounted(() => {
  const { start } = useSvgRegion({
    // 当窗口展示的时候
    winOnShow: () => {},
    // 当窗口隐藏的时候 我们需要隐藏录屏窗口
    winOnHide: () => window.useRecord.hide(),
    // 当点击按钮录制的时候 调用 useRecord.startRecord 方法
    onStartRecord: (recordOptions: RecordOptions) => {
      return window.useRecord.startRecord(recordOptions)
    },
    // 当点击停止录制的时候 调用 useRecord.stopRecord 方法
    onStopRecord: (callback: () => void) => {
      window.useRecord.onCloseWin((msg) => {
        console.log(msg)
        callback() // 这个callback是这个hooks用来处理内部的一些逻辑 需要手动调用
      })
    },
    // 当成功开始录制之后 我们需要更新图标 需要通知给圆形摄像头窗口和工具箱窗口
    onStartRecordSuccess: () => window.useRecord.message({ type: 'change-icon', msg: true }),
    // 当成功开始录制裁剪窗口之后 我们需要隐藏录屏窗口
    onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
    // 当成功开始录制全屏窗口之后 我们需要隐藏录屏窗口并显示透明的裁剪窗口
    onStartFullRecordSuccess: () => window.useRecord.hide(),
  })
  start()
})
</script>

<template>
  <div w-full h-full class="mask" />
</template>

<style scoped>
.mask {
  position: fixed;
  overflow: hidden;
  background: transparent;
}
</style>
