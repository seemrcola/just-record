<script setup lang='ts'>
import { ref } from 'vue'

const video = ref<HTMLVideoElement>()

window.useReplay.onReplayFile((videoSrc: any) => {
  console.log('videoSrc', videoSrc)
  video.value!.src = videoSrc
  window.useReplay.open() // 显示窗口 因为这个窗口只是被hide，而不是destroy，所以是可以直接显示的
});

</script>

<template>
  <div>
    <video ref="video" controls playsinline autoplay muted></video>
  </div>
</template>
