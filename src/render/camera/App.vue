<script setup lang="ts">
import { onMounted } from 'vue'

import UserMedia from './components/UserMedia.vue'
import { useDrag } from './composables'

const { run } = useDrag({
  afterDrag: (opt: { x: number, y: number }) => {
    window.useDrag['camera:drag']({ x: opt.x, y: opt.y })
  },
})

onMounted(() => {
  run()
})
</script>

<template>
  <div w-full h-full>
    <UserMedia />
  </div>
</template>
