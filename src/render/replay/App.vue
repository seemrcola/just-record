<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Player from './components/player.vue'

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
  <div w-full h-full class="bg">
    <Player />
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
