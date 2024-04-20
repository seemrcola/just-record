<script setup lang="ts">
import { NDialogProvider } from 'naive-ui'

import Record from './Record.vue'
</script>

<template>
  <NDialogProvider>
    <div w-full h-full>
      <Record />
    </div>
  </NDialogProvider>
</template>
