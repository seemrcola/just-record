<script setup lang="ts">
import { ref } from 'vue'

const recordingStatus = ref(false)

function toggleRecording(status: 'show' | 'stop') {
  console.log(status)
  window.useRecord[status]()
    .then(() => { })
    .catch(err => console.error(err))
}

window.useRecord.onStartRecord(() => {
  recordingStatus.value = true
})
window.useRecord.onStopRecord(() => {
  recordingStatus.value = false
})
</script>

<template>
  <div flex>
    <div class="fade-in hover:scale-110 transition-300" rounded-full cursor-pointer bg-orange-4 p-1>
      <div class="i-file-icons:fortherecord icon" h-4 w-4 text-light :class="{ 'text-red-5': recordingStatus }"
        @click="e => toggleRecording(recordingStatus ? 'stop' : 'show')" />
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: FadeIn 0.3s ease-in-out;
}

@keyframes FadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
