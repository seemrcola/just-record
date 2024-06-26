<script setup lang="ts">
import type { App } from 'vue'
import { createApp, nextTick, onMounted, onUnmounted, ref } from 'vue'
import Screenshot from './components/index.vue'
import { useHistoryStore, useScreenshotStore, useToolsStore } from './store'

let img: HTMLImageElement
let rect: App<Element>
const wrapper = ref<HTMLDivElement>()

function escHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.stopPropagation()
        window.useScreenshot.close()
    }
}

function backgroundImage(thumbnail: string) {
    img?.remove()
    const screenshotStore = useScreenshotStore()
    img = document.createElement('img')
    img.src = thumbnail
    img.id = screenshotStore.imgID
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
    const app = createApp(Screenshot)
    app.mount(wrapper.value!)
    rect = app
}

function getImageData() {
    const canvas = document.createElement('canvas')
    // 设置canvas宽高为图片原始宽高
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const screenshotStore = useScreenshotStore()
        screenshotStore.imgData = data
    }
}

window.useScreenshot.onScreenshotOpened(async (thumbnail: string) => {
    backgroundImage(thumbnail)
    await drawRect()
    await nextTick()
    getImageData()

    const screenshot = document.querySelector('.screenshot-root') as HTMLDivElement
    screenshot.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
})

window.useScreenshot.onScreenshotClosed(() => {
    img?.remove()
    rect?.unmount()
    // 清除body上所有的dom
    const body = document.body
    let child = body.lastElementChild
    while (child && child.id !== 'app') {
        body.removeChild(child)
        child = body.lastElementChild
    }
    // 保证截图时不会受到背景颜色的影响
    const screenshot = document.querySelector('.screenshot-root') as HTMLDivElement
    screenshot.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    // 清除工具栏被激活的功能
    const toolsStore = useToolsStore()
    toolsStore.clear()
    // 清除历史记录
    const historyStore = useHistoryStore()
    historyStore.history.clear()
})

onMounted(() => window.addEventListener('keydown', escHandler))
onUnmounted(() => window.removeEventListener('keydown', escHandler))
</script>

<template>
    <Suspense>
        <div ref="wrapper" w-full h-full class="screenshot-root" />
    </Suspense>
</template>

<style>
.screenshot-root {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.monospace {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
</style>
