<script setup lang="ts">
import { ref } from 'vue'
import { NTooltip } from 'naive-ui'

const recordingStatus = ref(false)

function toggleRecording(status: 'show' | 'stop') {
  window.useRecord[status]()
    .then(() => {})
    .catch(err => console.error(err))
}

window.useRecord.onChangeIcon((status: boolean) => {
  recordingStatus.value = status
})
</script>

<template>
  <div flex>
    <NTooltip trigger="hover">
      <template #trigger>
        <div
          class="fade-in hover:scale-110 transition-300"
          rounded-full
          cursor-pointer
          bg-orange-4 p-1
        >
          <div
            class="i-file-icons:fortherecord icon"
            h-5 w-5 text-light
            :class="{ 'text-red-5': recordingStatus }"
            @click="e => toggleRecording(recordingStatus ? 'stop' : 'show')"
          />
        </div>
      </template>
      <div>{{ recordingStatus ? '结束录制' : '开始录制' }}</div>
    </NTooltip>
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
