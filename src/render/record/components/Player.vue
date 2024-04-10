<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDialog } from 'naive-ui'

const props = defineProps({
  url: {
    type: String,
    required: true,
  }
})

const emits = defineEmits(['close', 'del', 'download'])

const dialog = useDialog()

const video = ref<HTMLVideoElement>()

function play() {
  setTimeout(() => {
    // 准备视频播放
    const videoPlayUrl = props.url
    video.value!.src = videoPlayUrl

    // 获取视频宽高
    video.value!.addEventListener('loadedmetadata', () => {
      const videoWidth = video.value!.videoWidth
      const videoHeight = video.value!.videoHeight
      // 调整视频大小 将最大的设置成720px
      const max = Math.max(videoWidth, videoHeight)
      const scale = 720 / max
      const width = videoWidth * scale
      const height = videoHeight * scale
      video.value!.style.width = `${width}px`
      video.value!.style.height = `${height}px`
    })
  })
}

function close() {
  emits('close')
}

function del() {
  dialog.warning({
    title: '警告',
    content: '确定要删除该录制文件吗',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // 删除
      emits('del')
    },
    onNegativeClick: () => {
      // 取消删除
      return 0
    },
  })
}

function download() {
  emits('download')
}

onMounted(() => {
  play()
})
</script>

<template>
  <div relative>
    <div
      absolute w-6 h-6 bg-light top--8 right-0 cursor-pointer hover="scale-110 bg-orange" i-mdi:close-box
      @click="close()"
    />
    <div
      absolute w-6 h-6 bg-light top--8 right-8 cursor-pointer hover="scale-110 bg-orange" i-material-symbols:delete
      @click="del()"
    />
    <div
      absolute w-6 h-6 bg-light top--8 right-16 cursor-pointer hover="scale-110 bg-orange" i-material-symbols:download
      @click="download()"
    />
    <video ref="video" controls playsinline autoplay muted b="2px solid orange" />
  </div>
</template>
