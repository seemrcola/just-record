<script setup lang='ts'>
import { onMounted, ref } from 'vue'

const video = ref<HTMLVideoElement>()

window.useReplay.onReplayFile((videoSrc: any) => {
  window.useReplay.open()

  setTimeout(() => {
      // 准备视频播放
    const videoPlayUrl = `local-resource://${videoSrc}`
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
})

</script>

<template>
  <div w-full h-full flex-center>
    <video ref="video" playsinline autoplay muted b="2px solid orange" />
  </div>
</template>
