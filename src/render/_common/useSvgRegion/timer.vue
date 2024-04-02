<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import dayjs from 'dayjs';

const hour = ref<number | string>(0);
const minute = ref<number | string>(0);
const second = ref<number | string>(0);

const interval = ref<NodeJS.Timeout | null>(null);

function startTimer() {
  const startTime = dayjs();
  interval.value = setInterval(() => {
    const now = dayjs();
    const diff = now.diff(startTime, 'second');
    hour.value = Math.floor(diff / 3600);
    minute.value = Math.floor((diff % 3600) / 60);
    second.value = diff % 60;
    
    if (second.value < 10) second.value = `0${second.value}`;
    if (minute.value < 10) minute.value = `0${minute.value}`;
    if (hour.value < 10) hour.value = `0${hour.value}`;

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
  <div w-full h-full flex>
    <button flex-1 bg-dark text-light>{{ hour }}</button>
    <button flex-1 bg-dark text-light>{{ minute }}</button>
    <button flex-1 bg-dark text-light>{{ second }}</button>
  </div>
</template>
