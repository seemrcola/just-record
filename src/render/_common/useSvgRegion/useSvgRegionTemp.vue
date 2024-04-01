<template>
  <svg id="mask-svg" width="100%" height="100%">
    <mask id="mask">
      <rect width="100%" height="100%" fill="white" />
    </mask>
    <rect width="100%" height="100%" mask="url(#mask)" fill="rgba(0, 0, 0, 0.3)" />
  </svg>
</template>

<style scoped>
svg {
  position: fixed;
  inset: 0;
  z-index: 9999;
}
</style>
