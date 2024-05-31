import { defineStore } from 'pinia'
import { ref } from 'vue'

class Stack {
    private stack: any[] = []
    push(item: any) {
        this.stack.push(item)
    }

    pop() {
        if (this.isEmpty())
            return null
        return this.stack.pop()
    }

    get length() {
        return this.stack.length
    }

    isEmpty() {
        return this.stack.length === 0
    }

    get top() {
        if (this.isEmpty())
            return null
        const len = this.stack.length
        return this.stack[len - 1]
    }

    clear() {
        this.stack = []
    }
}

export const useHistoryStore = defineStore('history', () => {
    const history = ref(new Stack())

    return {
        history,
    }
})
