/**
 * @param cb 回调函数
 * @param queue 回调函数队列
 * @description
 * 优化性能，防止频繁触发
 */
export function rafDebounce(cb: () => void, queue: any[]) {
  queue.push(cb)
  requestAnimationFrame(() => {
    if (queue.length !== 0) {
      const lastCallback = queue.pop()
      lastCallback && lastCallback()
      queue.length = 0
    }
  })
}
