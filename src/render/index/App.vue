<script setup lang="ts">
import { onMounted } from 'vue'
import { useDrag } from '../_common/useDrag'
import RecordBar from './components/RecordBar.vue'
import Timer from '../_common/useTimer/index.vue'
import Camera from './components/Camera.vue'
import Settings from './components/Settings.vue'

const { run } = useDrag({
  afterDrag: (opt: { x: number, y: number }) => {
    window.useDrag.drag({ x: opt.x, y: opt.y })
  },
})

onMounted(() => {
  run()
})
</script>

<template>
  <Suspense>
    <div h-full flex items-center px-2>
      <RecordBar />
      <Timer h-28px w-160px mx-2/>
      <Camera h-6 w-6 mx-4 />
      <Settings h-6 w-6 />  
    </div>
  </Suspense>
</template>
