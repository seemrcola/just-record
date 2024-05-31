<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue'
import { useDragRect } from '../composables/dragRect'
import { useDrawRect } from '../composables/drawRect'
import { useResizeRect } from '../composables/resizeRect'
import { betterBtoa, useResizeObserver } from '../composables/utils'
import type { Mode, Position } from '../types/index.d'
import {
    useDownload,
    useDrawSVGArrow,
    useDrawSVGEllipse,
    useDrawSVGLine,
    useDrawSVGRect,
    useMosaic,
    useSaveScreenshot,
    useText,
    useUndo,
} from '../composables/tools'

import Mosaic from './Mosaic.vue'
import Pen from './Pen.vue'
import Rect from './Rect.vue'
import Ellipse from './Ellipse.vue'
import Text from './Text.vue'
import Arrow from './Arrow.vue'

const mode = ref<Mode>('init')
let drag: ReturnType<typeof useDragRect>
let draw: ReturnType<typeof useDrawRect>
let resize: ReturnType<typeof useResizeRect>
let position: Position = 'left'
const screenshot = ref<HTMLCanvasElement>()
const rect = ref<HTMLDivElement>()
const editarea = ref<SVGSVGElement>()
const tools = ref<HTMLDivElement>()

let drawLine: ReturnType<typeof useDrawSVGLine>
let mosaic: ReturnType<typeof useMosaic>
let drawRect: ReturnType<typeof useDrawSVGRect>
let drawEllipse: ReturnType<typeof useDrawSVGEllipse>
let text: ReturnType<typeof useText>
let arrow: ReturnType<typeof useDrawSVGArrow>

// 为了解决一开始的时候tools就显示的问题 fixme 有没有更好的办法
const toolsFirstShow = ref(true)

// 监听工具栏的显示和隐藏 fixme: 这个写法是不是不够好 有没有不需要监听的写法
let closeObserver: () => void
function observeDOMDisplay(dom: HTMLElement) {
    const observer = new MutationObserver(() => {
        toolsFirstShow.value = false
        // 获取到工具栏的Rect 和 rect的Rect
        const toolsRect = tools.value!.getBoundingClientRect()
        const rectRect = rect.value!.getBoundingClientRect()
        // 是否超出屏幕
        const ifOutOfScreenY = rectRect.bottom + toolsRect.height >= window.innerHeight
        const ifOutOfScreenX = rectRect.left + rectRect.width <= toolsRect.width
        if (ifOutOfScreenY)
            tools.value!.style.bottom = '0'

        else
            tools.value!.style.bottom = '-36px'

        if (ifOutOfScreenX) {
            tools.value!.style.left = '0'
            tools.value!.style.right = 'auto'
        }
        else {
            tools.value!.style.left = 'auto'
            tools.value!.style.right = '0'
        }
    })
    observer.observe(dom, { attributes: true, attributeFilter: ['style'] })
    // 关闭监听
    return () => observer.disconnect()
}

// 监听截图区域大小变化
const observeSize = useResizeObserver(screenshot as any)

// 切换到drag模式
function handleRectMousedown(event: MouseEvent) {
    event.stopPropagation()
    // 如果是编辑状态 则不进入drag模式
    if (mode.value === 'edit')
        return
    mode.value = 'drag'
}

// 切换到edit模式
function changeToEditMode() {
    // mode 改动
    mode.value = 'edit'
    // 清除draw和drag和resize的监听
    draw.stopDraw()
    drag.stopDrag()
    resize.stopResize()
    // svg 初始化宽高 预备编辑
    const rect = screenshot.value!.getBoundingClientRect()!
    editarea.value!.setAttribute('width', `${rect.width}px`)
    editarea.value!.setAttribute('height', `${rect.height}px`)
    editarea.value!.style.left = `${rect.left}px`
    editarea.value!.style.top = `${rect.top}px`
}

// 切换到resize模式
function handlePosMousedown(event: MouseEvent) {
    event.stopPropagation()
    mode.value = 'resize'
    const posDOM = event.target as HTMLElement
    position = posDOM.dataset.pos as Position

    resize.startResize(event, position)
}

// 固钉功能 这个功能比较特殊 需要使用到另一个窗口 ----------------------------------
async function isofix() {
    const rect = screenshot.value!.getBoundingClientRect()!
    const ctx = screenshot.value!.getContext('2d')!

    const xml = new XMLSerializer().serializeToString(editarea.value!)
    const svgUrl = `data:image/svg+xml;base64,${betterBtoa(xml)}`
    const img = new Image()
    img.src = svgUrl
    img.onload = () => {
        const { width, height } = screenshot.value!
        // 考虑设备像素比例
        const ratio = window.devicePixelRatio || 1
        // 在绘制之前调整Canvas缩放
        ctx.scale(ratio, ratio)
        // 将 SVG 绘制到 Canvas 上，考虑缩放比
        ctx.drawImage(img, 0, 0, width / ratio, height / ratio)
        // // 恢复 Canvas 缩放
        ctx.scale(1 / ratio, 1 / ratio)
        // 拿到img的base64
        const base64 = screenshot.value!.toDataURL('image/png')

        window.useImage.isofix({
            width: rect.width,
            height: rect.height,
            x: rect.left,
            y: rect.top,
            base64,
        })
        window.useScreenshot.close()
    }
}
// --------------------------------------------------------------------------

async function download() {
    console.log('editarea.value')
    await useDownload(screenshot.value!, editarea.value!)
    // window.useScreenshot.close()
}

async function save() {
    const saveHanlder = useSaveScreenshot(screenshot.value!, editarea.value!)
    const res = await saveHanlder.save()
    if (res)
        window.useScreenshot.close()
}

function undo() {
    const { undo } = useUndo(screenshot.value!, editarea.value!)
    undo()
}

function close() {
    window.useScreenshot.close()
}

function drawRectHandler() {
    upperSvg()
    drawRect = useDrawSVGRect(screenshot.value!, editarea.value!)
    stopAllTools()
    drawRect.startDrawRect()
}

async function drawMosaicHanlder() {
    upperCanvas()
    mosaic = useMosaic(screenshot.value!, editarea.value!)
    stopAllTools()
    mosaic.startMosaic()
}

async function drawTextHandler() {
    upperSvg()
    text = await useText(screenshot.value!, editarea.value!)
    stopAllTools()
    text.startWriteText()
}

async function drawArrowHandler() {
    upperSvg()
    arrow = await useDrawSVGArrow(screenshot.value!, editarea.value!)
    stopAllTools()
    arrow.startDrawArrow()
}

async function penHandler() {
    upperSvg()
    drawLine = useDrawSVGLine(screenshot.value!, editarea.value!)
    stopAllTools()
    drawLine.startDrawLine()
}

function drawEllipseHandler() {
    upperSvg()
    drawEllipse = useDrawSVGEllipse(screenshot.value!, editarea.value!)
    stopAllTools()
    drawEllipse.startDrawEllipse()
}

async function stopAllTools() {
    mosaic?.stopMosaic()
    drawLine?.stopDrawLine()
    drawRect?.stopDrawRect()
    drawEllipse?.stopDrawEllipse()
    text?.stopWriteText()
    arrow?.stopDrawArrow()
}

function upperCanvas() {
    // 让上层是canvas只需要将editarea的pointer-events属性设置为none即可
    editarea.value!.style.pointerEvents = 'none'
}

function upperSvg() {
    // 让上层是svg需要将editarea的pointer-events属性设置为auto
    editarea.value!.style.pointerEvents = 'auto'
}

onMounted(() => {
    draw = useDrawRect(rect.value!, screenshot.value!, mode)
    drag = useDragRect(rect.value!, screenshot.value!, mode)
    resize = useResizeRect(rect.value!, screenshot.value!, mode)

    draw.startDraw()
    drag.startDrag()

    // 当这个页面出现的时候，进入draw模式
    mode.value = 'draw'

    // 处理工具栏的位置 不让它超出屏幕
    closeObserver = observeDOMDisplay(rect.value!)

    console.log(resize.startFlag.value, drag.startFlag.value, draw.startFlag.value, '---')
})

onUnmounted(() => {
    drag.stopDrag()
    draw.stopDraw()
    closeObserver()
})
</script>

<template>
    <div ref="rect" class="rect" @mousedown="handleRectMousedown">
        <!-- 这里是大小展示区域 -->
        <div
            min-w="80px" select-none p-1 bg-dark-2 text-light text-sm rounded-sm absolute top--36px left-10px z-999
            class="monospace"
        >
            {{ observeSize.width }} * {{ observeSize.height }}
        </div>
        <!-- 这里是截图区域 -->
        <div>
            <canvas ref="screenshot" w-0 h-0 fixed />
            <svg ref="editarea" w-0 h-0 fixed />
        </div>
        <!-- 这里是缩放区域 -->
        <div v-if="mode !== 'edit'" class="box">
            <div class="l" data-pos="left" @mousedown="handlePosMousedown" />
            <div class="r" data-pos="right" @mousedown="handlePosMousedown" />
            <div class="t" data-pos="top" @mousedown="handlePosMousedown" />
            <div class="b" data-pos="bottom" @mousedown="handlePosMousedown" />
            <div class="lt" data-pos="left-top" @mousedown="handlePosMousedown" />
            <div class="lb" data-pos="left-bottom" @mousedown="handlePosMousedown" />
            <div class="rt" data-pos="right-top" @mousedown="handlePosMousedown" />
            <div class="rb" data-pos="right-bottom" @mousedown="handlePosMousedown" />
        </div>
        <!-- 这里是功能区域 -->
        <div
            ref="tools" bg-dark-2 shadow-light flex items-center class="tools" :class="{
                'visible-none':
                    toolsFirstShow
                    || resize?.startFlag?.value
                    || drag?.startFlag?.value
                    || draw?.startFlag?.value,
            }"
        >
            <div flex @click.stop="changeToEditMode">
                <Ellipse @ellipse="drawEllipseHandler" />
                <Rect @rect="drawRectHandler" />
                <Arrow @arrow="drawArrowHandler" />
                <Text @text="drawTextHandler" />
                <Pen @pen="penHandler" />
                <Mosaic @mosaic="drawMosaicHanlder" />
            </div>
            <div h-5 w-2px bg-gray mx-3 />
            <div flex @mousedown.stop>
                <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:mic-external-off-outline text-light @click="isofix" />
                <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:undo-rounded text-light @click="undo" />
                <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:download text-light @click="download" />
                <div h-4 w-4 cursor-pointer px-2 py-1 i-material-symbols:close text-red @click="close" />
                <div h-4 w-4 cursor-pointer px-2 py-1 i-charm:tick text-blue @click="save" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.rect {
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
}

.tools {
  padding: 4px 12px;
  border-radius: 4px;
  position: absolute;
  z-index: 999;
}

.tools.visible-none {
  visibility: hidden;
}

.box>div {
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: rgb(40, 139, 226);
  cursor: pointer;
}

.l {
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.r {
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
}

.t {
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
}

.b {
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
}

.lt {
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
}

.lb {
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
}

.rt {
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
}

.rb {
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
}
</style>
