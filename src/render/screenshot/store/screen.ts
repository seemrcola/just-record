import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScreenshotStore = defineStore('screenshot', () => {
    const imgData = ref<any>()
    const imgID = 'background-image-screenshot'

    return {
        imgData,
        imgID,
    }
})
