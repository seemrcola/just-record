<script setup lang='ts'>
import { ref } from 'vue'

const video = ref<HTMLVideoElement>()
const img = ref<HTMLImageElement>()

window.useReplay.onReplayFile((videoSrc: any) => {
  console.log('videoSrc', videoSrc)
  video.value!.src = `local-resource://${videoSrc}`
  img.value!.src = `local-resource:///Users/zhukai/Desktop/1.png`
  window.useReplay.open()
})
</script>

<template>
  <div>
    <video ref="video" controls playsinline autoplay muted />
    <!-- <img ref="img" src="" alt=""> -->
  </div>
</template>
