<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { NDialogProvider } from 'naive-ui'
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
  <NDialogProvider>
    <div w-full h-full flex-center class="bg">
      <Player />
    </div>
  </NDialogProvider>
</template>

<style scoped lang="scss">
.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
