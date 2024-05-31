<script setup lang='ts'>
import { useToolsStore } from '../store'
import type { Color, Size } from '../types'
import BaseSize from './BaseSize.vue'
import BaseColor from './BaseColor.vue'

const emits = defineEmits<{
    (e: 'text'): void
}>()

const store = useToolsStore()

function pen() {
    store.changeShowChoose('Text')
    emits('text')
}

function changeSize(size: Size) {
    store.setTextSize(size)
}

function changeColor(color: Color) {
    store.setTextColor(color)
}
</script>

<template>
    <div relative>
        <div
            h-4 w-4 cursor-pointer px-2 py-1 i-mdi:format-text text-light
            :class="{ 'text-light': !store.showTextChoose, 'text-red': store.showTextChoose }"
            @mousedown.stop
            @click="pen"
        />
        <div v-if="store.showTextChoose" class="choose">
            <BaseSize :size="store.textSize" @change-size="changeSize" />
            <div h-4 mx-1 w-2px bg-gray />
            <BaseColor :color="store.textColor" @change-color="changeColor" />
        </div>
    </div>
</template>

<style scoped>
.choose {
  position: absolute;
  left: 50%;
  bottom: -42px;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  border-radius: 4px;
}
</style>
