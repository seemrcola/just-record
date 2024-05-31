<script setup lang="ts">
import type { Ref } from 'vue'

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
            <div
                class="i-iconoir:pause-window icon"
                text-xl mx-2 cursor-pointer transition-300 z-max
                hover="color-orange"
                :class="{ 'text-orange': props.currentRecorderType.value === 'window' }"
                @click="changeRecorderType('window')"
            />

            <div
                class="i-ic:outline-photo-size-select-small icon"
                text-xl mx-2 cursor-pointer transition-300 z-max
                hover=" color-orange"
                :class="{ 'text-orange': props.currentRecorderType.value === 'select' }"
                @click="changeRecorderType('select')"
            />
        </div>
        <div ml-4>
            <button
                border="1px solid" rounded="md" p="x-2 y-1"
                transition-300 cursor-pointer
                hover="bg-orange-500 text-light"
                @click="props.startRecord"
            >
                开始录制
            </button>
        </div>
    </div>
</template>
