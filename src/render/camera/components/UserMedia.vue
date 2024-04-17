<script setup lang='ts'>
import { onMounted, ref } from 'vue'

const video = ref<HTMLVideoElement>()

async function start() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      height: 240,
      width: 240,
    },
    audio: false,
  })
  video.value!.srcObject = stream // 绑定视频流到video元素
}

onMounted(() => {
  start()
})
</script>

<template>
  <div w-full h-full>
    <video ref="video" w-full h-full autoplay muted playsinline mirror />
  </div>
</template>
