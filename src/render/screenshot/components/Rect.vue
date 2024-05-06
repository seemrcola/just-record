<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDrawRect } from '../composables/drawRect'
import { useDragRect } from '../composables/dragRect'
import { useResizeRect } from '../composables/resizeRect'
import { useDownload, useMosaic, useSaveScreenshot, useDrawLine } from '../composables/tools'
import { useResizeObserver } from '../composables/utils'
import type { Mode, Position } from '../types/index.d'

import Mosaic from './Mosaic.vue'
import Pen from './Pen.vue'

const mode = ref<Mode>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
let resize: ReturnType<typeof useResizeRect>
const position = ref<Position>('left')
const screenshot = ref<HTMLCanvasElement>()

let drawLine: ReturnType<typeof useDrawLine>
let mosaic: ReturnType<typeof useMosaic>

// 监听截图区域大小变化
const observeSize = useResizeObserver(screenshot as any)

// 切换到drag模式
function handleRectMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  // 如果是编辑状态 则不进入drag模式
  if (mode.value === 'edit')
    return
  mode.value = 'drag'
}

// 切换到edit模式
function changeToEditMode() {
  mode.value = 'edit'
}

// 切换到resize模式
function handlePosMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  mode.value = 'resize'
  const posDOM = event.target as HTMLElement
  position.value = posDOM.dataset.pos as Position

  const rectDOM = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  resize = useResizeRect(rectDOM, screenshot, mode, position)
  resize.startResize(event)
}

function download() {
  useDownload(screenshot.value!)
  window.useScreenshot.close()
}

async function save() {
  const res = await useSaveScreenshot(screenshot.value!)
  if (res)
    window.useScreenshot.close()
}

function close() {
  window.useScreenshot.close()
}

async function drawMosaic() {
  mosaic = useMosaic(screenshot.value!)
  stopAllTools()
  mosaic.startMosaic()
}

async function pen() {
  drawLine = useDrawLine(screenshot.value!)
  stopAllTools()
  drawLine.startDrawLine()
}

async function stopAllTools() {
  mosaic?.stopMosaic()
  drawLine?.stopDrawLine()
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
    <!-- 这里是大小展示区域 -->
    <div
      min-w="80px" p-1 bg-dark-2 text-light text-sm rounded-sm absolute top--36px left-10px z-999
      class="monospace"
    >
      {{ observeSize.width }} * {{ observeSize.height }}
    </div>
    <!-- 这里是截图区域 -->
    <canvas ref="screenshot" class="screenshot" fixed z-99 />
    <!-- 这里是缩放区域 -->
    <div v-if="mode !== 'edit'" class="box">
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
    <div bg-dark-2 shadow-light flex items-center class="tools">
      <div flex @click.stop="changeToEditMode">
        <Mosaic @mosaic="drawMosaic" />
        <Pen @pen="pen" />
      </div>
      <div h-5 w-2px bg-gray mx-3 />
      <div flex>
        <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:download text-light @click="download" />
        <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:close text-red @click="close" />
        <div h-4 w-4 cursor-pointer px-2 py-1 i-icon-park-outline:correct text-blue @click="save" />
      </div>
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
