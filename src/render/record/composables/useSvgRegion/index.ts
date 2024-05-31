import type { App } from 'vue'
import { createApp, ref } from 'vue'
import useRecordTipTemp from './useRecordTipTemp.vue'
import useSvgRegionTemp from './useSvgRegionTemp.vue'
import { createDragRect, createholeRect, updateRect } from './hepler'

type DragMode =
    'move' |
    'resize-top-left' |
    'resize-top-right' |
    'resize-bottom-left' |
    'resize-bottom-right'

interface RecordOptions {
    x: number
    y: number
    width: number
    height: number
    fullScreen: boolean
}

interface RegionLifeCycle {
    // 窗口的显示与隐藏
    winOnHide: () => void
    winOnShow: () => void
    // 点击开始录制按钮 与 关闭svg窗口
    onStartRecord: (recordOptions: RecordOptions) => Promise<any>
    onStopRecord: (callback: () => void) => void
    // 当成功开始录制之后
    onStartRecordSuccess: () => void
    onStartClipRecordSuccess: () => void
    onStartFullRecordSuccess: () => void
}

export function useSvgRegion(wrapper: string, regionLifeCycle: RegionLifeCycle) {
    let svg: SVGSVGElement // svg 获取到这个名称是useSvgRegionTemp中的svg-mask
    let drag: SVGRectElement // drag-rect 用于拖拽
    let hole: SVGRectElement // svg mask 挖出来的洞
    let recordBoxDom: HTMLElement // 录制的提示盒子的dom
    let recordBox: App<Element> // 录制的提示盒子 即recordTipTemp.vue组件createApp的返回值

    const wrapperElement = (document.querySelector(wrapper) || document.body) as HTMLElement

    const WINDOW_WIDTH = window.innerWidth // 窗口宽度
    const WINDOW_HEIGHT = window.innerHeight // 窗口高度

    let peerPoint = { x: 0, y: 0 } // resize功能启用时的对端点

    let __start = false
    let __start_drag = false
    let __drag_mode: DragMode = 'move'
    let startPoint = { x: 0, y: 0 }
    let startDragPoint = { x: 0, y: 0 }

    // 清除svg
    function clearSvg() {
        const mask = svg.querySelector('#mask-svg') as SVGMaskElement

        mask?.remove()
        recordBoxDom?.remove()
        recordBox?.unmount()
    }

    // 监听窗口的关闭
    regionLifeCycle.onStopRecord(() => {
    // 还原颜色以便于下一次打开的时候颜色正常
    // 将svg的颜色还原
        hole.setAttribute('stroke', 'black')
        // 将drag的虚线还原
        drag.setAttribute('stroke', 'orange')
        // 渲染提示框
        recordTip()
        // 添加回来esc按钮的监听
        document.addEventListener('keydown', escCallback)
    })

    async function escCallback(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            // 隐藏
            await regionLifeCycle.winOnHide()
        }
    }

    function start() {
        createFullScreenSvg()
        svg = document.querySelector('#mask-svg') as SVGSVGElement // 这个名称是useSvgRegionTemp.vue中定义的 算是写死的
        document.addEventListener('mousedown', startRegion)
        document.addEventListener('keydown', escCallback)
    }

    function startRegion(e: MouseEvent) {
        __start = true
        // 如果已经有mask-rect 那么不能再次绘制
        if (document.querySelector('#mask-rect'))
            return

        // 记录clientX
        const { clientX, clientY } = e
        startPoint = {
            x: clientX,
            y: clientY,
        }

        document.addEventListener('mousemove', moveRegion)
        document.addEventListener('mouseup', endRegion)
    }

    function moveRegion(e: MouseEvent) {
        if (!__start)
            return

        const { clientX, clientY } = e

        drawRegion({
            startX: startPoint.x,
            startY: startPoint.y,
            endX: clientX,
            endY: clientY,
        })
    }

    function endRegion() {
        __start = false
        document.removeEventListener('mousemove', moveRegion)
        document.removeEventListener('mouseup', endRegion)

        // 给mask-rect添加监听
        drag = svg.querySelector('#drag-rect') as SVGRectElement
        drag.addEventListener('mousedown', mousedownHandler)
    }

    function mousedownHandler(e: MouseEvent) {
        __start_drag = true
        drag.style.cursor = 'pointer'

        const { clientX, clientY } = e
        startDragPoint = {
            x: clientX,
            y: clientY,
        }
        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHanlder)

        // 当鼠标不在定点附近的时候视为move
        const { x, y, width, height } = hole.getBBox()
        const distTopLeft = Math.sqrt((x - clientX) ** 2 + (y - clientY) ** 2)
        const distTopRight = Math.sqrt((x + width - clientX) ** 2 + (y - clientY) ** 2)
        const distBottomLeft = Math.sqrt((x - clientX) ** 2 + (y + height - clientY) ** 2)
        const distBottomRight = Math.sqrt((x + width - clientX) ** 2 + (y + height - clientY) ** 2)
        const threshold = 10 // 设定一个阈值，判断是否点击在角上

        if (distTopLeft < threshold) {
            __drag_mode = 'resize-top-left'
            peerPoint = { x: x + width, y: y + height }
        }
        else if (distTopRight < threshold) {
            __drag_mode = 'resize-top-right'
            peerPoint = { x, y: y + height }
        }
        else if (distBottomLeft < threshold) {
            __drag_mode = 'resize-bottom-left'
            peerPoint = { x: x + width, y }
        }
        else if (distBottomRight < threshold) {
            __drag_mode = 'resize-bottom-right'
            peerPoint = { x, y }
        }
        else {
            __drag_mode = 'move'
            drag.style.cursor = 'move'
        }
    }

    function mousemoveHandler(e: MouseEvent) {
        if (!__start_drag)
            return

        const { clientX, clientY } = e
        const dx = clientX - startDragPoint.x
        const dy = clientY - startDragPoint.y

        let { x, y, width, height } = drag.getBBox()

        switch (__drag_mode) {
            case 'move':
                x += dx
                y += dy
                break
            case 'resize-top-left':
                x += dx
                y += dy
                width -= dx
                height -= dy
                break
            case 'resize-top-right':
                y += dy
                width += dx
                height -= dy
                break
            case 'resize-bottom-left':
                x += dx
                width -= dx
                height += dy
                break
            case 'resize-bottom-right':
                width += dx
                height += dy
                break
        }

        if (width < 0) {
            switch (__drag_mode) {
                case 'resize-top-left':
                    __drag_mode = 'resize-top-right'
                    break
                case 'resize-bottom-left':
                    __drag_mode = 'resize-bottom-right'
                    break
                case 'resize-top-right':
                    __drag_mode = 'resize-top-left'
                    break
                case 'resize-bottom-right':
                    __drag_mode = 'resize-bottom-left'
                    break
            }
            width = Math.abs(width)
            x -= width
        }

        if (height < 0) {
            switch (__drag_mode) {
                case 'resize-top-left':
                    __drag_mode = 'resize-bottom-left'
                    break
                case 'resize-top-right':
                    __drag_mode = 'resize-bottom-right'
                    break
                case 'resize-bottom-left':
                    __drag_mode = 'resize-top-left'
                    break
                case 'resize-bottom-right':
                    __drag_mode = 'resize-top-right'
                    break
            }
            height = Math.abs(height)
            y -= height
        }

        x = Math.max(0, Math.min(x, WINDOW_WIDTH - width))
        y = Math.max(0, Math.min(y, WINDOW_HEIGHT - height))

        updateRect(hole, x, y, width, height)
        updateRect(drag, x, y, width, height)

        startDragPoint = { x: clientX, y: clientY }

        recordTip()
    }

    function mouseupHanlder() {
        __start_drag = false
        drag.style.cursor = 'default'
        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHanlder)
    }

    function createFullScreenSvg() {
        const app = createApp(useSvgRegionTemp)
        const fragment = document.createDocumentFragment()
        app.mount(fragment as unknown as HTMLElement)
        wrapperElement.appendChild(fragment)
    }

    function drawRegion({ startX, startY, endX, endY }: { startX: number, startY: number, endX: number, endY: number }) {
        if (!svg)
            return

        const width = Math.abs(endX - startX)
        const height = Math.abs(endY - startY)
        const left = Math.min(startX, endX)
        const top = Math.min(startY, endY)

        // 获取mask
        const mask = svg.querySelector('#mask') as SVGMaskElement
        if (!svg.querySelector('#mask-rect')) {
            const rect = createholeRect(left, top, width, height)
            mask.appendChild(rect)
            hole = rect // 保存hole
        }
        else {
            updateRect(hole, left, top, width, height)
        }

        // 由于这个rect是不能做任何交互的 所以为了交互我们要再加一个rect去做交互
        // 清除掉drag-rect的内容 重新绘制
        if (!svg.querySelector('#drag-rect')) {
            const dragRect = createDragRect(left, top, width, height)
            svg.appendChild(dragRect)
            drag = dragRect // 保存drag
        }
        else {
            updateRect(drag, left, top, width, height)
        }

        recordTip()
    }

    function recordTip() {
        if (recordBox) {
            recordBox.unmount()
            recordBoxDom?.remove()
        }

        const currentRecorderType = ref<'window' | 'select'>('window')
        recordBox = createApp(useRecordTipTemp, {
            currentRecorderType,
            startRecord: () => {
                // 由于物理像素和设备逻辑之间有区别 需要转为物理像素 同时⚠️由于有一个宽度为1的边框 需要处理掉这个边框
                const x = Number(hole.getAttribute('x'))
                const y = Number(hole.getAttribute('y'))
                const recordOptions = {
                    fullScreen: currentRecorderType.value === 'window',
                    x,
                    y,
                    width: Number(hole.getAttribute('width')),
                    height: Number(hole.getAttribute('height')),
                }

                // 去掉hole的边框颜色
                hole.setAttribute('stroke', 'transparent')
                // 去掉drag的虚线
                drag.setAttribute('stroke', 'transparent')

                // 开始录制
                regionLifeCycle.onStartRecord(recordOptions)
                    .then(async () => {
                        // 通用success回调
                        await regionLifeCycle.onStartRecordSuccess()

                        // 首先根据全屏录制还是区域录制来判断是否需要隐藏窗口
                        if (currentRecorderType.value === 'window')
                            await regionLifeCycle.onStartFullRecordSuccess()

                        if (currentRecorderType.value === 'select') {
                            // 需要删掉各种提示框
                            recordBoxDom?.remove()
                            // 去掉esc按钮的监听
                            document.removeEventListener('keydown', escCallback)
                            // 一般情况下需要 告诉窗口让它变成可穿透窗口
                            await regionLifeCycle.onStartClipRecordSuccess()
                        }
                    })
                    .catch((err) => {
                        console.error(err)

                        // 失败了还原颜色
                        hole.setAttribute('stroke', 'black')
                        drag.setAttribute('stroke', 'orange')
                    })
            },
        })
        recordBoxDom = document.createElement('div')
        recordBox.mount(recordBoxDom)

        const holeRect = hole.getBBox()
        recordBoxDom.style.cssText = `
      position: fixed;
      top: ${holeRect.y + holeRect.height - 10}px;
      left: ${holeRect.x + holeRect.width / 2}px;
      transform: translate(-50%, -100%);
      z-index: 9999;
      background-color: rgb(29, 29, 29);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      color: #fff;
    `
        wrapperElement.appendChild(recordBoxDom)
    }

    return {
        start,
        clearSvg,
    }
}
