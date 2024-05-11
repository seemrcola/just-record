<script setup lang='ts'>
import { useToolsStore } from '../store'
import type { Color, Size } from '../types'
import BaseSize from './BaseSize.vue'
import BaseColor from './BaseColor.vue'

const emits = defineEmits<{
  (e: 'pen'): void
}>()

const store = useToolsStore()

function pen() {
  store.changeShowChoose('Pen')
  emits('pen')
}

function changeSize(size: Size) {
  store.setPenSize(size)
}

function changeColor(color: Color) {
  store.setPenColor(color)
}
</script>

<template>
  <div relative>
    <div
      h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:edit-outline text-light
      :class="{ 'text-light': !store.showPenChoose, 'text-red': store.showPenChoose }"
      @mousedown.stop
      @click="pen"
    />
    <div v-if="store.showPenChoose" class="choose">
      <BaseSize :size="store.penSize" @change-size="changeSize" />
      <div h-4 mx-1 w-2px bg-gray />
      <BaseColor :color="store.penColor" @change-color="changeColor" />
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
