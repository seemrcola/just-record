<script setup lang='ts'>
import type { Color } from '../types'

const props = defineProps<{
    color: Color
}>()

const emits = defineEmits<{
    (e: 'changeColor', color: Color): void
}>()

function changeColor(color: Color) {
    emits('changeColor', color)
}
</script>

<template>
    <div flex px-2 items-center>
        <div w-6 h-4 mx-1 bg-orange :class="{ 'active-border': props.color === 'orange' }" @click="changeColor('orange')" />
        <div w-6 h-4 mx-1 bg-red-5 :class="{ 'active-border': props.color === 'red' }" @click="changeColor('red')" />
        <div w-6 h-4 mx-1 bg-green-5 :class="{ 'active-border': props.color === 'green' }" @click="changeColor('green')" />
        <div w-6 h-4 mx-1 bg-yellow-5 :class="{ 'active-border': props.color === 'yellow' }" @click="changeColor('yellow')" />
        <div w-6 h-4 mx-1 bg-blue-5 :class="{ 'active-border': props.color === 'blue' }" @click="changeColor('blue')" />
        <div w-6 h-4 mx-1 bg-purple-5 :class="{ 'active-border': props.color === 'purple' }" @click="changeColor('purple')" />
        <div w-6 h-4 mx-1 bg-light :class="{ 'active-border': props.color === 'white' }" @click="changeColor('white')" />
        <div w-6 h-4 mx-1 bg-dark :class="{ 'active-border': props.color === 'black' }" @click="changeColor('black')" />
    </div>
</template>

<style scoped>
.active-border {
  border: 2px solid #fff;
}
</style>
