<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useDrawRect } from '../composables/drawRect'
import { useDragRect } from '../composables/dragRect'

const mode = ref<'draw' | 'drag'>('draw')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>

function handleClick(event: MouseEvent) {
  const pos = (event.target as HTMLElement).dataset.pos
  console.log(pos)
}

onMounted(() => {
  const box = document.querySelector('.rect') as HTMLElement
  const screenshot = document.querySelector('.screenshot') as HTMLCanvasElement
  draw = useDrawRect(box, screenshot, mode)
  drag = useDragRect(box, screenshot, mode)
  draw.startDraw()
  drag.startDrag()
})
</script>

<template>
  <div class="rect">
    <!-- 这里是截图区域 -->
    <canvas class="screenshot" fixed z-99 />
    <!-- 这里是缩放区域 -->
    <div class="box" @click="handleClick">
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
  border: 2px dashed orange;
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
