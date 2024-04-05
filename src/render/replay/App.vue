<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Player from './components/player.vue'
import { NDialogProvider } from 'naive-ui'

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
  <n-dialog-provider>
    <div w-full h-full flex-center class="bg">
      <Player />
    </div>
  </n-dialog-provider>
</template>

<style scoped lang="scss">
.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
