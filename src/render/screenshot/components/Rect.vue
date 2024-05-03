<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDrawRect } from '../composables/drawRect'
import { useDragRect } from '../composables/dragRect'
import { useResizeRect } from '../composables/resizeRect'
import { useDownload, useSaveScreenshot, useMosaic } from '../composables/tools'
import type { Position } from '../composables/types'

const mode = ref<'draw' | 'drag' | 'transable'>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
let resize: ReturnType<typeof useResizeRect>
const position = ref<Position>('left')
const screenshot = ref<HTMLCanvasElement>()
const mosaicWorkStatus = ref(false)

function handleRectMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  if(mosaicWorkStatus.value) return
  mode.value = 'drag'
}

function handlePosMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  mode.value = 'transable'
  const posDOM = event.target as HTMLElement
  position.value = posDOM.dataset.pos as Position

  const rectDOM = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  resize = useResizeRect(rectDOM, screenshot, mode, position)
  resize.startResize(event)
}

function download() {
  // 获取canvas的base64编码
  useDownload(screenshot.value!)
  window.useScreenshot.close()
}

async function save() {
  const res = await useSaveScreenshot(screenshot.value!)
  if (res)
    window.useScreenshot.close()
}

async function mosaic(e: MouseEvent) {
  e.preventDefault()
  mosaicWorkStatus.value = true
  const mosaic = useMosaic(screenshot.value!)
  mosaic.startMosaic()
}

onMounted(() => {
  const rectDOM = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  draw = useDrawRect(rectDOM, screenshot, mode)
  drag = useDragRect(rectDOM, screenshot, mode)
  draw.startDraw()
  drag.startDrag()
})
</script>

<template>
  <div class="rect" @mousedown="handleRectMousedown">
    <!-- 这里是截图区域 -->
    <canvas class="screenshot" ref="screenshot" fixed z-99 />
    <!-- 这里是缩放区域 -->
    <div class="box">
      <div class="l" data-pos="left" @mousedown="handlePosMousedown" />
      <div class="r" data-pos="right" @mousedown="handlePosMousedown" />
      <div class="t" data-pos="top" @mousedown="handlePosMousedown" />
      <div class="b" data-pos="bottom" @mousedown="handlePosMousedown" />
      <div class="lt" data-pos="left-top" @mousedown="handlePosMousedown" />
      <div class="lb" data-pos="left-bottom" @mousedown="handlePosMousedown" />
      <div class="rt" data-pos="right-top" @mousedown="handlePosMousedown" />
      <div class="rb" data-pos="right-bottom" @mousedown="handlePosMousedown" />
    </div>
    <!-- 这里是功能区域 -->
    <div bg-dark-2 shadow-light flex class="tools">
      <div 
        h-4 w-4 cursor-pointer px-2 py-1 i-mingcute:mosaic-line text-light
        :class="{ 'text-light': !mosaicWorkStatus, 'text-red': mosaicWorkStatus }" 
        @mousedown.stop
        @click.stop="mosaic"
      />
      <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:download text-light @click.stop="download" />
      <div h-4 w-4 cursor-pointer px-2 py-1 i-icon-park-outline:correct text-light @click.stop="save" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rect {
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
}

.tools {
  padding: 4px 12px;
  border-radius: 4px;
  position: absolute;
  bottom: -36px;
  right: 0;
  z-index: 999;
}

.box>div {
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: rgb(40, 139, 226);
  cursor: pointer;
}

.l {
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.r {
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
}

.t {
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
}

.b {
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}

.lt {
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
}

.lb {
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
}

.rt {
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
}

.rb {
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
}
</style>
