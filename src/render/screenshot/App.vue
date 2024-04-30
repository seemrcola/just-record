<script setup lang="ts">
import { onMounted, onUnmounted, createApp, App, ref } from 'vue';
import { NDialogProvider } from 'naive-ui'
import Rect from './components/Rect.vue'

let img: HTMLImageElement
let rect: App<Element>
const wrapper = ref<HTMLDivElement>()

function escHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    window.useScreenshot.close();
  }
}

function backgroundImage(thumbnail: string) {
  img = document.createElement('img');
  img.src = thumbnail;
  img.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;`
  document.body.appendChild(img);
}

function drawRect() {
  const app = createApp(Rect);
  app.mount(wrapper.value!);
  rect = app
}

window.useScreenshot.onScreenshotOpened(async (thumbnail: string) => {
  backgroundImage(thumbnail)
  drawRect()
})

window.useScreenshot.onScreenshotClosed(() => {
  document.body.removeChild(img);
  rect.unmount();
})

onMounted(() => window.addEventListener('keydown', escHandler));
onUnmounted(() => window.removeEventListener('keydown', escHandler));
</script>

<template>
  <Suspense>
    <NDialogProvider>
      <div w-full h-full class="bg" ref="wrapper" />
    </NDialogProvider>
  </Suspense>
</template>

<style scoped>
.bg {
  background: rgba(0, 0, 0, 0.3);
}
</style>
