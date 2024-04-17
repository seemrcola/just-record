<script setup lang='ts'>
import { ref } from 'vue'

const isCameraOpen = ref(false)

function handleClick() {
  if (!isCameraOpen.value)
    window.useCamera.open()
  else
    window.useCamera.close()
}

window.useCamera.onCameraOpened(() => {
  isCameraOpen.value = true
})

window.useCamera.onCameraClosed(() => {
  isCameraOpen.value = false
})
</script>

<template>
  <div
    i-material-symbols:screen-record-rounded text-light cursor-pointer
    :class="{ 'bg-red': isCameraOpen }"
    @click="handleClick"
  />
</template>
