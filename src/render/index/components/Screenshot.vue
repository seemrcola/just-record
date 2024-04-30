<script setup lang='ts'>
import { ref } from 'vue'

const isScreenshot = ref(false)

function handleClick() {
  if (!isScreenshot.value)
    window.useScreenshot.open()
  else
    window.useScreenshot.close()
}

window.useScreenshot.onScreenshotOpened(() => {
  isScreenshot.value = true
})

window.useScreenshot.onScreenshotClosed(() => {
  isScreenshot.value = false
})
</script>

<template>
  <div
    i-icon-park-twotone:screenshot-two text-light cursor-pointer :class="{ 'bg-red': isScreenshot }"
    @click="handleClick"
  />
</template>
