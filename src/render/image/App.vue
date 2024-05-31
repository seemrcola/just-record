<script setup lang="ts">
import { ref } from 'vue'

const imgSrc = ref('')

function close() {
    window.useImage.close()
}
window.useImage.onIsofixFinished((imgUrl: string) => {
    imgSrc.value = imgUrl
})
</script>

<template>
    <div w-full h-full relative>
        <img :src="imgSrc" alt="" w-full h-full>
        <div
            class="no-drag"
            i-solar:trash-bin-trash-broken
            absolute right-2 bottom-2 text-xl bg-light
            hover="bg-red-500 scale-110 cursor-pointer"
            @click="close"
        />
    </div>
</template>
