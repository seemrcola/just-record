<script setup lang="ts">
import type { App } from 'vue'
import { createApp, onMounted, onUnmounted, ref } from 'vue'
import { NDialogProvider } from 'naive-ui'
import Rect from './components/Rect.vue'

let img: HTMLImageElement
let rect: App<Element>
const wrapper = ref<HTMLDivElement>()
const imgID = 'background-image-screenshot'

function escHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    window.useScreenshot.close()
  }
}

function backgroundImage(thumbnail: string) {
  img?.remove()
  img = document.createElement('img')
  img.src = thumbnail
  img.id = imgID
  img.style.cssText = `
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;`
  document.body.appendChild(img)
}

async function drawRect() {
  rect?.unmount()
  const app = createApp(Rect)
  app.mount(wrapper.value!)
  rect = app
}

window.useScreenshot.onScreenshotOpened(async (thumbnail: string) => {
  backgroundImage(thumbnail)
  await drawRect()
})

window.useScreenshot.onScreenshotClosed(() => {
  img?.remove()
  rect?.unmount()
})

onMounted(() => window.addEventListener('keydown', escHandler))
onUnmounted(() => window.removeEventListener('keydown', escHandler))
</script>

<template>
  <Suspense>
    <NDialogProvider>
      <div ref="wrapper" w-full h-full class="bg" />
    </NDialogProvider>
  </Suspense>
</template>

<style scoped>
.bg {
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
