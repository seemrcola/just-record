<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue'
import { useScreenshotStore } from '../store'

const store = useScreenshotStore()
const imgID = store.imgID

const coord = ref({ x: 0, y: 0 })
const color = ref('')
const wrapperRef = ref<HTMLDivElement>()
const zoomLevel = 4
const CANVAS_SIZE = 100
const ratio = window.devicePixelRatio

function mousemoveHandler(event: MouseEvent) {
  const { pageX, pageY } = event
  coord.value = { x: pageX, y: pageY }

  const canvas = document.querySelector('#coord-canvas') as HTMLCanvasElement
  // 如果组件已经卸载，则不再绘制坐标点
  if (!canvas)
    return

  // 放大镜效果
  magnifying(canvas)
  // 颜色值计算
  getColor()

  wrapperRef.value!.style.left = `${coord.value.x - 120}px`
  wrapperRef.value!.style.top = `${coord.value.y + 60}px`
}

function magnifying(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  const img = document.querySelector(`#${imgID}`) as HTMLImageElement

  // 以coord为中心，截一个图，宽100px 高100px
  // 先按照当前分辨率绘制，然后缩放到100px
  canvas.width = CANVAS_SIZE * ratio
  canvas.height = CANVAS_SIZE * ratio
  ctx.drawImage(
    img,
    (coord.value.x - CANVAS_SIZE / 2 / zoomLevel) * ratio,
    (coord.value.y - CANVAS_SIZE / 2 / zoomLevel) * ratio,
    CANVAS_SIZE * ratio / zoomLevel,
    CANVAS_SIZE * ratio / zoomLevel,
    0,
    0,
    canvas.width,
    canvas.height,
  )
}

function getColor() {
  const imgData = store.imgData
  if (!imgData)
    return
  // 取中心点的像素值
  const x = coord.value.x * ratio
  const y = coord.value.y * ratio
  const i = (y * imgData.width + x) * 4
  const r = imgData.data[i]
  const g = imgData.data[i + 1]
  const b = imgData.data[i + 2]
  const a = imgData.data[i + 3]
  // 转成 #RRGGBBAA 格式
  const RGBA = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`
  color.value = RGBA.toUpperCase()
}

onMounted(() => {
  document.addEventListener('mousemove', mousemoveHandler)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', mousemoveHandler)
})
</script>

<template>
  <div ref="wrapperRef" fixed left="0" top="0" z-max class="monospace">
    <div relative h-100px w-100px>
      <canvas id="coord-canvas" h-full w-full box-border border="1px dashed orange" />
      <!-- 一横一竖两个div 用来标识坐标点 -->
      <div w-1px h-100px bg-orange absolute left="50%" top="0" />
      <div w-100px h-1px bg-orange absolute top="50%" />
    </div>

    <div w-100px border="1px solid orange" box-border mt-1>
      <div bg-light text-dark flex px-1 w-full box-border>
        <div flex-1 flex-center>
          {{ coord.x }}
        </div>
        <div flex-1 flex-center>
          {{ coord.y }}
        </div>
      </div>

      <div flex-center bg-light text-dark px-1 w-full box-border>
        <div h-16px w-16px bg-dark :style="{ backgroundColor: color }" />
        <div text-sm>
          {{ color }}
        </div>
      </div>
    </div>
  </div>
</template>
