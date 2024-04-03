<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import dayjs from 'dayjs';
import Number from './number.vue';

const hour = ref<string>('00');
const minute = ref<string>('00');
const second = ref<string>('00');

const interval = ref<NodeJS.Timeout | null>(null);

function startTimer() {
  const startTime = dayjs();
  interval.value = setInterval(() => {
    const now = dayjs();
    const diff = now.diff(startTime, 'second');
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    hour.value = h.toString().padStart(2, '0');
    minute.value = m.toString().padStart(2, '0');
    second.value = s.toString().padStart(2, '0');
  }, 1000)
}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});
</script>

<template>
  <div w-full h-full flex rounded-1 bg-light>
    <div flex-1 bg-dark text-light flex-center rounded-1>
      <Number :number="hour[0]" />
      <Number :number="hour[1]" />
    </div>
    <div flex-1 bg-dark text-light flex-center rounded-1 mx-2px>
      <Number :number="minute[0]" />
      <Number :number="minute[1]" />
    </div>
    <div flex-1 bg-dark text-light flex-center rounded-1>
      <Number :number="second[0]" />
      <Number :number="second[1]" />
    </div>
  </div>
</template>
