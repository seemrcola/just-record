<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDragRect } from '../composables/dragRect'
import { useDrawRect } from '../composables/drawRect'
import { useResizeRect } from '../composables/resizeRect'
import { useDownload, useDrawSVGEllipse, useDrawSVGLine, useDrawSVGRect, useMosaic, useSaveScreenshot, useUndo, useText } from '../composables/tools'
import { useResizeObserver } from '../composables/utils'
import type { Mode, Position } from '../types/index.d'

import Mosaic from './Mosaic.vue'
import Pen from './Pen.vue'
import Rect from './Rect.vue'
import Ellipse from './Ellipse.vue'
import Text from './Text.vue'

const mode = ref<Mode>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
let resize: ReturnType<typeof useResizeRect>
const position = ref<Position>('left')
const screenshot = ref<HTMLCanvasElement>()
const rect = ref<HTMLDivElement>()
const editarea = ref<SVGSVGElement>()

let drawLine: ReturnType<typeof useDrawSVGLine>
let mosaic: ReturnType<typeof useMosaic>
let drawRect: ReturnType<typeof useDrawSVGRect>
let drawEllipse: ReturnType<typeof useDrawSVGEllipse>
let text: ReturnType<typeof useText>

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
  // mode 改动
  mode.value = 'edit'
  // svg 初始化宽高 预备编辑
  const rect = screenshot.value!.getBoundingClientRect()!
  editarea.value!.setAttribute('width', `${rect.width}px`)
  editarea.value!.setAttribute('height', `${rect.height}px`)
  editarea.value!.style.left = `${rect.left}px`
  editarea.value!.style.top = `${rect.top}px`
}

// 切换到resize模式
function handlePosMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  mode.value = 'resize'
  const posDOM = event.target as HTMLElement
  position.value = posDOM.dataset.pos as Position

  resize = useResizeRect(rect.value!, screenshot.value!, mode, position)
  resize.startResize(event)
}

async function download() {
  await useDownload(screenshot.value!, editarea.value!)
  // window.useScreenshot.close()
}

async function save() {
  const saveHanlder = useSaveScreenshot(screenshot.value!, editarea.value!)
  const res = await saveHanlder.save()
  if (res)
    window.useScreenshot.close()
}

function undo() {
  const { undo } = useUndo(screenshot.value!, editarea.value!)
  undo()
}

function close() {
  window.useScreenshot.close()
}

function drawRectHandler() {
  upperSvg()
  drawRect = useDrawSVGRect(screenshot.value!, editarea.value!)
  stopAllTools()
  drawRect.startDrawRect()
}

async function drawMosaicHanlder() {
  upperCanvas()
  mosaic = useMosaic(screenshot.value!, editarea.value!)
  stopAllTools()
  mosaic.startMosaic()
}

async function drawTextHandler() {
  upperSvg()
  text = await useText(screenshot.value!, editarea.value!)
  stopAllTools()
  text.startWriteText()
}

async function penHandler() {
  upperSvg()
  drawLine = useDrawSVGLine(screenshot.value!, editarea.value!)
  stopAllTools()
  drawLine.startDrawLine()
}

function drawEllipseHandler() {
  upperSvg()
  drawEllipse = useDrawSVGEllipse(screenshot.value!, editarea.value!)
  stopAllTools()
  drawEllipse.startDrawEllipse()
}

async function stopAllTools() {
  mosaic?.stopMosaic()
  drawLine?.stopDrawLine()
  drawRect?.stopDrawRect()
  drawEllipse?.stopDrawEllipse()
  text?.stopWriteText()
}

function upperCanvas() {
  // 让上层是canvas只需要将editarea的pointer-events属性设置为none即可
  editarea.value!.style.pointerEvents = 'none'
}

function upperSvg() {
  // 让上层是svg需要将editarea的pointer-events属性设置为auto
  editarea.value!.style.pointerEvents = 'auto'
}

onMounted(() => {
  draw = useDrawRect(rect.value!, screenshot.value!, mode)
  drag = useDragRect(rect.value!, screenshot.value!, mode)
  draw.startDraw()
  drag.startDrag()
})
</script>

<template>
  <div ref="rect" class="rect" @mousedown="handleRectMousedown">
    <!-- 这里是大小展示区域 -->
    <div min-w="80px" p-1 bg-dark-2 text-light text-sm rounded-sm absolute top--36px left-10px z-999 class="monospace">
      {{ observeSize.width }} * {{ observeSize.height }}
    </div>
    <!-- 这里是截图区域 -->
    <div>
      <canvas ref="screenshot" fixed />
      <svg ref="editarea" fixed />
    </div>
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
        <Ellipse @ellipse="drawEllipseHandler" />
        <Rect @rect="drawRectHandler" />
        <Mosaic @mosaic="drawMosaicHanlder" />
        <Text @text="drawTextHandler" />
        <Pen @pen="penHandler" />
      </div>
      <div h-5 w-2px bg-gray mx-3 />
      <div flex>
        <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:undo-rounded text-light @click="undo" />
        <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:download text-light @click="download" />
        <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:close text-red @click="close" />
        <div h-4 w-4 cursor-pointer px-2 py-1 i-charm:tick text-blue @click="save" />
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
