<script setup lang='ts'>
import { useToolsStore } from '../store'
import type { Color } from '../types'
import BaseColor from './BaseColor.vue'

const emits = defineEmits<{
    (e: 'ellipse'): void
}>()

const store = useToolsStore()

function pen() {
    store.changeShowChoose('Ellipse')
    emits('ellipse')
}

function changeColor(color: Color) {
    store.setEllipseColor(color)
}
</script>

<template>
    <div relative>
        <div
            h-4 w-4 cursor-pointer px-2 py-1 i-mdi:ellipse-outline text-light
            :class="{ 'text-light': !store.showEllipseChoose, 'text-red': store.showEllipseChoose }"
            @mousedown.stop
            @click="pen"
        />
        <div v-if="store.showEllipseChoose" class="choose">
            <BaseColor :color="store.ellipseColor" @change-color="changeColor" />
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
