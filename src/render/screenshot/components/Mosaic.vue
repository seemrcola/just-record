<script setup lang='ts'>
import { ref } from 'vue'
import { useMosaicStore } from '../store'

const store = useMosaicStore()

const props = defineProps({
  mosaicWorkStatus: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<{
  (e: 'mosaic'): void
}>()

const showChoose = ref(false)

function changeType(type: 'light' | 'heavy') {
  store.setMosaicType(type)
}

function mosaic() {
  showChoose.value = true
  emits('mosaic')
}
</script>

<template>
  <div relative>
    <div
      h-4 w-4 cursor-pointer px-2 py-1 i-mingcute:mosaic-line text-light
      :class="{ 'text-light': !props.mosaicWorkStatus, 'text-red': props.mosaicWorkStatus }"
      @mousedown.stop
      @click="mosaic"
    />
    <div v-if="showChoose" class="choose">
      <div
        :class="{ 'bg-orange': store.mosaicType === 'light' }"
        i-mingcute:mosaic-line mx-2 text-light text-1.15rem
        @click="changeType('light')"
      />
      <div
        :class="{ 'bg-orange': store.mosaicType === 'heavy' }"
        i-icon-park-outline:mosaic mx-2 text-light
        @click="changeType('heavy')"
      />
    </div>
  </div>
</template>

<style scoped>
.choose {
  position: absolute;
  left: 50%;
  bottom: -42px;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  border-radius: 4px;
}
</style>
