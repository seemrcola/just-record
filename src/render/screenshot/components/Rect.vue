<script setup lang='ts'>
import { useDrawRect } from '../composables/drawRect'
import { onMounted } from 'vue'

function handleClick(event: MouseEvent) {
  const pos = (event.target as HTMLElement).dataset.pos;
  console.log(pos);
}

onMounted(() => {
  const box = document.querySelector('.rect') as HTMLElement;
  const { startDraw } = useDrawRect(box);
  startDraw();
})
</script>

<template>
  <div class="rect">
    <div @click="handleClick" class="box">
      <div class="l" data-pos="left"></div>
      <div class="r" data-pos="right"></div>
      <div class="t" data-pos="top"></div>
      <div class="b" data-pos="bottom"></div>
      <div class="lt" data-pos="left-top"></div>
      <div class="lb" data-pos="left-bottom"></div>
      <div class="rt" data-pos="right-top"></div>
      <div class="rb" data-pos="right-bottom"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rect {
  box-sizing: border-box;
  border: 2px dashed orange;
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
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
