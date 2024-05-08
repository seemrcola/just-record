<script setup lang='ts'>
import { useToolsStore } from '../store'
import type { Color } from '../types'
import BaseColor from './BaseColor.vue'

const emits = defineEmits<{
  (e: 'rect'): void
}>()

const store = useToolsStore()

function pen() {
  store.changeShowChoose('Rect')
  emits('rect')
}

function changeColor(color: Color) {
  store.setRectColor(color)
}
</script>

<template>
  <div relative>
    <div
      h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:rectangle-outline-rounded text-light
      :class="{ 'text-light': !store.showRectChoose, 'text-red': store.showRectChoose }"
      @mousedown.stop
      @click="pen"
    />
    <div v-if="store.showRectChoose" class="choose">
      <BaseColor :color="store.rectColor" @change-color="changeColor" />
    </div>
  </div>
</template>

<style scoped>
.choose {
  position: absolute;
  left: 50%;
  bottom: -42px;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  border-radius: 4px;
}
</style>
