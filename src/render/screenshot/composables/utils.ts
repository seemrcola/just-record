import { nextTick, ref, onMounted, onUnmounted, Ref } from 'vue'
import { useScreenshotStore } from '../store'

export async function useCanvas(
  screenshot: HTMLCanvasElement,
  { x, y, height, width }: { x: number, y: number, height: number, width: number },
) {
  const screenshotStore = useScreenshotStore()
  const imgID = screenshotStore.imgID
  // 将画布的这部分绘制到canvas
  const scale = window.devicePixelRatio
  const ctx = screenshot.getContext('2d')!
  // 先按照实际要绘制的大小设置画布大小
  screenshot.width = width * scale
  screenshot.height = height * scale
  // 获取图片
  const img = document.querySelector(`#${imgID}`) as HTMLImageElement
  ctx.drawImage(
    img,
    x * scale,
    y * scale,
    width * scale,
    height * scale,
    0,
    0,
    width * scale,
    height * scale,
  )
  await nextTick()
  screenshot.style.height = `${height}px`
  screenshot.style.width = `${width}px`
  // 设置canvas的位置
  screenshot.style.left = `${x}px`
  screenshot.style.top = `${y}px`
}

// 定义返回类型
interface Size {
  width: Ref<number>;
  height: Ref<number>;
}

// 创建一个名为 useResizeObserver 的 hook
export function useResizeObserver(target: Ref<Element | null>): Size {
  const width = ref(0);
  const height = ref(0);

  let observer: ResizeObserver | null = null;

  const startObserving = () => {
    if (observer !== null) {
      observer.disconnect();
    }
    observer = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const entry = entries[0];
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    });

    if (target.value) {
      observer.observe(target.value);
    }
  };

  onMounted(() => {
    startObserving();
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return { width, height };
}
