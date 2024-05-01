<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDrawRect } from '../composables/drawRect'
import { useDragRect } from '../composables/dragRect'
import { useTransable } from '../composables/transable'
import { Position } from '../composables/types'

const mode = ref<'draw' | 'drag' | 'transable'>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
  let transable: ReturnType<typeof useTransable>
  let position = ref<Position>('left')

function handleMousedown(event: MouseEvent) {
  event.preventDefault()
  mode.value = 'transable'
  const pos = (event.target as HTMLElement).dataset.pos
  position.value = pos as Position
}

onMounted(() => {
  const box = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  draw = useDrawRect(box, screenshot, mode)
  drag = useDragRect(box, screenshot, mode)
  transable = useTransable(box, screenshot, mode, position)
  draw.startDraw()
  drag.startDrag()
  transable.startTransable()
})
</script>

<template>
  <div class="rect">
    <!-- 这里是截图区域 -->
    <canvas class="screenshot" fixed z-99 />
    <!-- 这里是缩放区域 -->
    <div class="box" @mousedown="handleMousedown">
      <div class="l" data-pos="left" />
      <div class="r" data-pos="right" />
      <div class="t" data-pos="top" />
      <div class="b" data-pos="bottom" />
      <div class="lt" data-pos="left-top" />
      <div class="lb" data-pos="left-bottom" />
      <div class="rt" data-pos="right-top" />
      <div class="rb" data-pos="right-bottom" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rect {
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
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
