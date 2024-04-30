<script setup lang="ts">
import { NDialogProvider } from 'naive-ui'

import Record from './Interface.vue'
</script>

<template>
  <Suspense>
    <NDialogProvider>
      <div w-full h-full>
        <Record />
      </div>
    </NDialogProvider>
  </Suspense>
</template>
