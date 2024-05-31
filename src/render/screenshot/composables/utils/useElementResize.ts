import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export function useResizeObserver(target: Ref<Element | null>) {
    const width = ref(0)
    const height = ref(0)

    let observer: ResizeObserver | null = null

    const startObserving = () => {
        if (observer !== null)
            observer.disconnect()

        observer = new ResizeObserver((entries) => {
            if (entries.length === 0)
                return
            const entry = entries[0]
            width.value = entry.contentRect.width
            height.value = entry.contentRect.height
        })

        if (target.value)
            observer.observe(target.value)
    }

    onMounted(() => {
        startObserving()
    })

    onUnmounted(() => {
        if (observer)
            observer.disconnect()
    })

    return { width, height }
}
