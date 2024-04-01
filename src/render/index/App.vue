<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDrag } from '../_common/useDrag'
import UserMedia from './components/UserMedia.vue'
import RecordBar from './components/RecordBar.vue'

const { run } = useDrag({
  afterDrag: (opt: { x: number, y: number }) => {
    window.useDrag.drag({ x: opt.x, y: opt.y })
  },
})

const type = ref<'video' | 'settings'>('video')
const showFooter = ref(false)

onMounted(() => {
  run()
})
</script>

<template>
  <Suspense>
    <div
      w-full h-full relative
      @mouseenter="showFooter = true"
      @mouseleave="showFooter = false"
    >
      <UserMedia v-if="type === 'video'" />
      <RecordBar v-show="showFooter" />
    </div>
  </Suspense>
</template>
