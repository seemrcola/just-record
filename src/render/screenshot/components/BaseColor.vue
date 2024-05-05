<script setup lang='ts'>
import { ref } from 'vue'
import type { Color } from '../types'

const emits = defineEmits<{
  (e: 'changeColor', color: Color): void
}>()

const baseColor = ref<Color>('red')

function changeColor(color: Color) {
  baseColor.value = color
  emits('changeColor', color)
}
</script>

<template>
  <div flex px-2 items-center>
    <div w-6 h-4 mx-1 bg-orange :class="{ 'active-border': baseColor === 'orange' }" @click="changeColor('orange')" />
    <div w-6 h-4 mx-1 bg-red-5 :class="{ 'active-border': baseColor === 'red' }" @click="changeColor('red')" />
    <div w-6 h-4 mx-1 bg-green-5 :class="{ 'active-border': baseColor === 'green' }" @click="changeColor('green')" />
    <div w-6 h-4 mx-1 bg-yellow-5 :class="{ 'active-border': baseColor === 'yellow' }" @click="changeColor('yellow')" />
    <div w-6 h-4 mx-1 bg-blue-5 :class="{ 'active-border': baseColor === 'blue' }" @click="changeColor('blue')" />
    <div w-6 h-4 mx-1 bg-purple-5 :class="{ 'active-border': baseColor === 'purple' }" @click="changeColor('purple')" />
    <div w-6 h-4 mx-1 bg-light :class="{ 'active-border': baseColor === 'light' }" @click="changeColor('light')" />
    <div w-6 h-4 mx-1 bg-dark :class="{ 'active-border': baseColor === 'dark' }" @click="changeColor('dark')" />
  </div>
</template>

<style scoped>
.active-border {
  border: 2px solid #fff;
}
</style>
