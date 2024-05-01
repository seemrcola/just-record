<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDrawRect } from '../composables/drawRect'
import { useDragRect } from '../composables/dragRect'
import { useTransable } from '../composables/transableRect'
import { Position } from '../composables/types'

const mode = ref<'draw' | 'drag' | 'transable'>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
let transable: ReturnType<typeof useTransable>
let position = ref<Position>('left')

function handleMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  mode.value = 'transable'
  const posDOM = event.target as HTMLElement
  position.value = posDOM.dataset.pos as Position

  const rectDOM = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  transable = useTransable(rectDOM, screenshot, mode, position)
  transable.startTransable(event)
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
  <div class="rect">
    <!-- 这里是截图区域 -->
    <canvas class="screenshot" fixed z-99 />
    <!-- 这里是缩放区域 -->
    <div class="box">
      <div class="l" data-pos="left" @mousedown="handleMousedown" />
      <div class="r" data-pos="right" @mousedown="handleMousedown" />
      <div class="t" data-pos="top" @mousedown="handleMousedown" />
      <div class="b" data-pos="bottom" @mousedown="handleMousedown" />
      <div class="lt" data-pos="left-top" @mousedown="handleMousedown" />
      <div class="lb" data-pos="left-bottom" @mousedown="handleMousedown" />
      <div class="rt" data-pos="right-top" @mousedown="handleMousedown" />
      <div class="rb" data-pos="right-bottom" @mousedown="handleMousedown" />
    </div>
    <!-- 这里是功能区域 -->
    <!-- <div bg-dark shadow-md class="tools">
      <div i-lets-icons:done-all-alt-round></div>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.rect {
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
}

.tools {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

.box>div {
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: rgb(115, 171, 221);
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
