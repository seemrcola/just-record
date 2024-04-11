<script setup lang="ts">
import type { Ref } from 'vue'
import { NButton, NTooltip } from 'naive-ui'

const props = defineProps<{
  startRecord: () => void
  currentRecorderType: Ref<string>
}>()

function changeRecorderType(type: string) {
  props.currentRecorderType.value = type
}
</script>

<template>
  <div p="x-2 y-1" flex items-center>
    <div flex>
      <NTooltip>
        <template #trigger>
          <div
            class="i-iconoir:pause-window icon"
            text-xl mx-2 cursor-pointer transition-300 z-max
            hover="color-orange"
            :class="{ 'text-orange': props.currentRecorderType.value === 'window' }"
            @click="changeRecorderType('window')"
          />
        </template>
        <div>抓取屏幕</div>
      </NTooltip>
      <NTooltip>
        <template #trigger>
          <div
            class="i-ic:outline-photo-size-select-small icon"
            text-xl mx-2 cursor-pointer transition-300 z-max
            hover=" color-orange"
            :class="{ 'text-orange': props.currentRecorderType.value === 'select' }"
            @click="changeRecorderType('select')"
          />
        </template>
        <div>抓取范围</div>
      </Ntooltip>
    </div>
    <div ml-4>
      <NButton bg="dark" text-light size="small" @click="props.startRecord">
        开始录制
      </NButton>
    </div>
  </div>
</template>
