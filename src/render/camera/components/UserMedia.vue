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
  <div class="video-container" w-full h-full bg-amber-500>
    <video 
      ref="video" 
      w-full h-full rounded-full fixed z-max mirror
      autoplay muted playsinline  
      @click.stop 
    />
  </div>
</template>

<style scoped>
.video-container::after {
  content: '按ctrl+r刷新摄像头';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: white;
  text-shadow: 1px 1px 2px black;
}
</style>
