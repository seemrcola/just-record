<script setup lang='ts'>
import { ref } from 'vue'

const emits = defineEmits(['startTimer'])

const timeStatus = ref(false)
function handleClick() {
  timeStatus.value = !timeStatus.value
  emits('startTimer', timeStatus.value)
}
</script>

<template>
  <div
    i-majesticons:timer-line
    :class="{ 'text-light': !timeStatus, 'text-red-5': timeStatus }"
    @click="handleClick"
  />
</template>
