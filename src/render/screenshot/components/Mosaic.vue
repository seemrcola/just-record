<script setup lang='ts'>
import { useToolsStore } from '../store'

const emits = defineEmits<{
  (e: 'mosaic'): void
}>()

const store = useToolsStore()

function changeType(type: 'light' | 'heavy') {
  store.setMosaicType(type)
}

function mosaic() {
  store.changeShowChoose('Mosaic')
  emits('mosaic')
}
</script>

<template>
  <div relative>
    <div
      h-4 w-4 cursor-pointer px-2 py-1 i-mingcute:mosaic-line text-light
      :class="{ 'text-light': !store.showMosaicChoose, 'text-red': store.showMosaicChoose }"
      @mousedown.stop
      @click="mosaic"
    />
    <div v-if="store.showMosaicChoose" class="choose">
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
