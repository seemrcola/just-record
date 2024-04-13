<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RecordBar from './components/RecordBar.vue'
import Camera from './components/Camera.vue'
import Settings from './components/Settings.vue'
import { Timer, useDrag } from './composables'

const timer = ref<typeof Timer>()

const { run } = useDrag({
  afterDrag: (opt: { x: number, y: number }) => {
    window.useDrag.drag({ x: opt.x, y: opt.y })
  },
})

onMounted(() => {
  run()
})

window.useRecord.onChangeIcon((msg: boolean) => {
  console.log(msg, '-----------------')
  if(msg) 
    timer.value && timer.value.startTimer()
  else 
    timer.value && timer.value.stopTimer()
})
</script>

<template>
  <Suspense>
    <div h-full flex items-center px-2>
      <RecordBar />
      <Timer ref="timer" h-28px w-160px mx-2 />
      <Camera h-6 w-6 mx-4 />
      <Settings h-6 w-6 />
    </div>
  </Suspense>
</template>
