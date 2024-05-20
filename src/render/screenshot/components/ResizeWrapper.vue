<!-- 这个文件暂时没有用到 这是为了给绘制图形做resize用的 -->

<script setup lang='ts'>
import { onMounted, ref } from 'vue'

const props = defineProps({
  x: {type: Number, default: 0},
  y: {type: Number, default: 0},
  width: {type: Number, default: 0},
  height: {type: Number, default: 0},
})

const resizeWrapper = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const resizeWrapperEl = resizeWrapper.value!
  resizeWrapperEl.style.left = `${props.x}px`
  resizeWrapperEl.style.top = `${props.y}px`
  resizeWrapperEl.style.width = `${props.width}px`
  resizeWrapperEl.style.height = `${props.height}px`
})
</script>

<template>
  <div ref="resizeWrapper" fixed z-max>
    <!-- 八个方位的点 -->
    <div class="resize-point lt"></div>
    <div class="resize-point rt"></div>
    <div class="resize-point lb"></div>
    <div class="resize-point rb"></div>
    <div class="resize-point t"></div>
    <div class="resize-point b"></div>
    <div class="resize-point l"></div>
    <div class="resize-point r"></div>
  </div>
</template>

<style scoped lang="scss">
  .resize-point {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(7, 71, 98, 0.7);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
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
