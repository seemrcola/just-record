<script setup lang="ts">
import { ref } from 'vue'
import RecordBar from './components/RecordBar.vue'
import Camera from './components/Camera.vue'
import Screenshot from './components/Screenshot.vue'
import Clock from './components/Clock.vue'
import { Timer } from './composables'

const timer = ref<typeof Timer>()

window.useRecord.onStartRecord(() => {
  startTimer(true)
})

window.useRecord.onStopRecord(() => {
  startTimer(false)
})

function startTimer(status: boolean) {
  if (status)
    timer.value && timer.value.startTimer()
  else
    timer.value && timer.value.stopTimer()
}
</script>

<template>
  <Suspense>
    <div h-full flex items-center px-4>
      <RecordBar class="no-drag" />
      <Timer ref="timer" class="no-drag" h-28px w-160px mx-3 />
      <Clock class="no-drag" h-6 w-6 mr-3 @start-timer="startTimer" />
      <Camera class="no-drag" h-6 w-6 mr-3 />
      <Screenshot class="no-drag" h-5 w-5 />
    </div>
  </Suspense>
</template>
