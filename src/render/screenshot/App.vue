<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { NDialogProvider } from 'naive-ui'

function escHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    window.useScreenshot.close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', escHandler);
});

onUnmounted(() => {
  window.removeEventListener('keydown', escHandler);
});
</script>

<template>
  <Suspense>
    <NDialogProvider>
      <div w-full h-full class="bg">
      </div>
    </NDialogProvider>
  </Suspense>
</template>

<style scoped>
.bg {
  background: rgba(0, 0, 0, 0.3);
}
</style>
