<script setup lang="ts">
import { ref } from 'vue'

const constraints = {
  video: true,
  audio: true,
}
const user = ref<HTMLVideoElement | null>(null)
const mediaStream = ref<MediaStream | null>(null)
const error = ref<string | null>(null)

getUserMedia()
function getUserMedia() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      mediaStream.value = stream
      user.value!.srcObject = stream
    })
    .catch((err) => {
      error.value = err.message
    })
}
</script>

<template>
  <div w-full h-full>
    <video
      ref="user"
      playsinline muted autoplay
      class="w-full h-full mirror object-cover rounded-full"
    />
  </div>
</template>
