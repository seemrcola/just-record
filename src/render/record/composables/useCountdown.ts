import { createApp } from 'vue'
import Countdown from '../components/Countdown.vue'

export async function useCountdown() {
  return new Promise((resolve) => {
    const app = createApp(Countdown)
    const fragment = document.createDocumentFragment()
    app.mount(fragment as any)
    document.body.appendChild(fragment)

    setTimeout(() => {
      resolve(true)
      app.unmount()
    }, 5000)
  })
}
