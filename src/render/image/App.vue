<script setup lang="ts">
import { ref } from 'vue'
const imgSrc = ref('http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg')
</script>

<template>
  <div w-full h-full>
    <img :src="imgSrc" alt="">
  </div>
</template>
