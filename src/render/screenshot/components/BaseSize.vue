<script setup lang='ts'>
import { ref } from 'vue'
import type { Size } from '../types'

const emits = defineEmits<
  (e: 'changeSize', size: Size) => void
>()

const size = ref<Size>('small')

function changeSize(newSize: Size) {
  size.value = newSize
  emits('changeSize', newSize)
}
</script>

<template>
  <div px-2 flex items-center text-light>
    <div i-mdi:checkbox-blank-circle w-3 h-3 :class="{ 'bg-orange': size === 'small' }" @click="changeSize('small')" />
    <div i-mdi:checkbox-blank-circle w-4 h-4 mx-2 :class="{ 'bg-orange': size === 'medium' }" @click="changeSize('medium')" />
    <div i-mdi:checkbox-blank-circle w-5 h-5 :class="{ 'bg-orange': size === 'large' }" @click="changeSize('large')" />
  </div>
</template>
