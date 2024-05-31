<script setup lang='ts'>
import { useToolsStore } from '../store'
import type { Color } from '../types'
import BaseColor from './BaseColor.vue'

const emits = defineEmits<{
    (e: 'arrow'): void
}>()

const store = useToolsStore()

function arrow() {
    store.changeShowChoose('Arrow')
    emits('arrow')
}

function changeColor(color: Color) {
    store.setArrowColor(color)
}
</script>

<template>
    <div relative>
        <div
            h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:arrow-outward text-light
            :class="{ 'text-light': !store.showArrowChoose, 'text-red': store.showArrowChoose }"
            @mousedown.stop
            @click="arrow"
        />
        <div v-if="store.showArrowChoose" class="choose">
            <BaseColor :color="store.arrowColor" @change-color="changeColor" />
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
