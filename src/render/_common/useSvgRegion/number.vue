<script setup lang='ts'>
import { ref, watch } from 'vue';

const props = defineProps({
  number: {
    type: String,
    required: true
  }
})

/**
 *     0
 * 1       2
 *     3
 * 4       5
 *     6
*/

const digitsMap = new Map()
const segments = ref([])
digitsMap.set('0', [1, 1, 1, 0, 1, 1, 1])
digitsMap.set('1', [0, 0, 1, 0, 0, 1, 0])
digitsMap.set('2', [1, 0, 1, 1, 1, 0, 1])
digitsMap.set('3', [1, 0, 1, 1, 0, 1, 1])
digitsMap.set('4', [0, 1, 1, 1, 0, 1, 0])
digitsMap.set('5', [1, 1, 0, 1, 0, 1, 1])
digitsMap.set('6', [1, 1, 0, 1, 1, 1, 1])
digitsMap.set('7', [1, 0, 1, 0, 0, 1, 0])
digitsMap.set('8', [1, 1, 1, 1, 1, 1, 1])
digitsMap.set('9', [1, 1, 1, 1, 0, 1, 1])

watch(
  () => props.number,
  (number: string) => {
    const segmentsArray = digitsMap.get(number)
    segments.value = segmentsArray
  },
  { immediate: true }
)
</script>

<template>
  <svg width="16" height="24" xmlns="http://www.w3.org/2000/svg">
    <!-- Top segment -->
    <rect x="4" y="0" width="8" height="2" rx="1" ry="1" fill="white" v-if="segments[0]" />
    <!-- Top left segment -->
    <rect x="2" y="2" width="2" height="7" rx="1" ry="1" fill="white" v-if="segments[1]" />
    <!-- Top right segment -->
    <rect x="12" y="2" width="2" height="7" rx="1" ry="1" fill="white" v-if="segments[2]" />
    <!-- Middle segment -->
    <rect x="4" y="10" width="8" height="2" rx="1" ry="1" fill="white" v-if="segments[3]" />
    <!-- Bottom left segment -->
    <rect x="2" y="12" width="2" height="7" rx="1" ry="1" fill="white" v-if="segments[4]" />
    <!-- Bottom right segment -->
    <rect x="12" y="12" width="2" height="7" rx="1" ry="1" fill="white" v-if="segments[5]" />
    <!-- Bottom segment -->
    <rect x="4" y="20" width="8" height="2" rx="1" ry="1" fill="white" v-if="segments[6]" />
  </svg>
</template>
