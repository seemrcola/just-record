<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

function escHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    console.log('esc pressed')
    window.useReplay.close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', escHandler)
})

onUnmounted(() => {
  window.removeEventListener('keydown', escHandler)
})
</script>

<template>
  <div w-full h-full />
</template>
