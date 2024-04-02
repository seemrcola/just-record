import type { App } from 'vue'
import { createApp, ref } from 'vue'
import useRecordTipTemp from './useRecordTipTemp.vue'
import useSvgRegionTemp from './useSvgRegionTemp.vue'
import Timer from './timer.vue'

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
  // 开始录制 与 停止录制
  onStartRecord: (recordOptions: RecordOptions) => Promise<any>
  onStopRecord: (callback: () => void) => void
  // 当成功开始录制之后
  onStartRecordSuccess: () => void
  onStartClipRecordSuccess: () => void
  onStartFullRecordSuccess: () => void
}

export function useSvgRegion(regionLifeCycle: RegionLifeCycle) {
  let svg: SVGSVGElement // svg 获取到这个名称是useSvgRegionTemp中的svg-mask
  let drag: SVGRectElement // drag-rect 用于拖拽
  let hole: SVGRectElement // svg mask 挖出来的洞
  let resizeBoxDom: HTMLElement // resize的提示盒子
  let recordBoxDom: HTMLElement // 录制的提示盒子的dom
  let timerBoxDom: HTMLElement // 计时器的提示盒子的dom
  let recordBox: App<Element> // 录制的提示盒子 即recordTipTemp.vue组件createApp的返回值
  let timerBox: App<Element> // 计时器的提示盒子 即timer.vue组件createApp的返回值

  // ⚠️ 这里的宽高是屏幕的宽高 因为是全屏的 如果不是全屏 则需要除以缩放比例
  const WINDOW_WIDTH = window.innerWidth // 窗口宽度
  const WINDOW_HEIGHT = window.innerHeight // 窗口高度
  // 屏幕当前缩放比例
  const scale = window.devicePixelRatio

  let __start = false
  let __start_drag = false
  let __drag_mode: 'move' | 'resize' = 'move'
  let startPoint = { x: 0, y: 0 }
  let startDragPoint = { x: 0, y: 0 }

  // 监听窗口的关闭 即监听录制结束
  regionLifeCycle.onStopRecord(() => {
    // 还原颜色以便于下一次打开的时候颜色正常
    // 将svg的颜色还原
    hole.setAttribute('stroke', 'black')
    // 将drag的虚线还原
    drag.setAttribute('stroke', 'orange')
    // 渲染提示框
    resizeTip()
    recordTip()
    // 停止计时器
    timerBox?.unmount()
    timerBoxDom?.remove()
    // 添加回来esc按钮的监听
    document.addEventListener('keydown', escCallback)
  })

  async function escCallback(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // 隐藏
      // await window.useRecord.hide()
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
    drag.addEventListener('mousedown', rectMouseDown)
  }

  function rectMouseDown(e: MouseEvent) {
    __start_drag = true
    drag.style.cursor = 'pointer'

    const { clientX, clientY } = e
    startDragPoint = {
      x: clientX,
      y: clientY,
    }
    document.addEventListener('mousemove', rectMouseMove)
    document.addEventListener('mouseup', rectMouseUp)

    // 当鼠标不在定点附近的时候视为move
    const { x, y, width, height } = hole.getBBox()
    // 计算出鼠标到矩形右下角的距离
    const dist = Math.sqrt((x + width - clientX) ** 2 + (y + height - clientY) ** 2) // 右下角
    if (dist > 16)
      __drag_mode = 'move'
    else
      __drag_mode = 'resize'
  }

  function rectMouseMove(e: MouseEvent) {
    if (!__start_drag)
      return

    const { clientX, clientY } = e
    const dx = clientX - startDragPoint.x
    const dy = clientY - startDragPoint.y

    if (__drag_mode === 'move') {
      // 如果达到边界了就不再移动
      const x = Number(drag.getAttribute('x'))
      const y = Number(drag.getAttribute('y'))
      const rectWidth = Number(drag.getAttribute('width'))
      const rectHeight = Number(drag.getAttribute('height'))
      let movex = x + dx
      let movey = y + dy

      // 如果达到上边界
      movey = Math.max(0, movey)
      // 如果达到左边界
      movex = Math.max(0, movex)
      // 如果达到右边界
      movex = Math.min(movex, WINDOW_WIDTH - rectWidth)
      // 如果达到下边界 下边界需要减去deltaY
      movey = Math.min(movey, WINDOW_HEIGHT - rectHeight)

      drag.setAttribute('x', `${movex}`)
      drag.setAttribute('y', `${movey}`)
      hole.setAttribute('x', `${movex}`)
      hole.setAttribute('y', `${movey}`)
    }
    if (__drag_mode === 'resize') {
      // 小于0的时候不变
      if (Number(hole.getAttribute('width')) + dx < 0 || Number(hole.getAttribute('height')) + dy < 0)
        return
      hole.setAttribute('width', `${Number(hole.getAttribute('width')) + dx}`)
      hole.setAttribute('height', `${Number(hole.getAttribute('height')) + dy}`)
      drag.setAttribute('width', `${Number(drag.getAttribute('width')) + dx}`)
      drag.setAttribute('height', `${Number(drag.getAttribute('height')) + dy}`)
    }

    startDragPoint = {
      x: clientX,
      y: clientY,
    }

    resizeTip()
    recordTip()
  }

  function rectMouseUp() {
    __start_drag = false
    drag.style.cursor = 'default'
    document.removeEventListener('mousemove', rectMouseMove)
    document.removeEventListener('mouseup', rectMouseUp)
  }

  function createFullScreenSvg() {
    const app = createApp(useSvgRegionTemp)
    const fragment = document.createDocumentFragment()
    app.mount(fragment as unknown as HTMLElement)
    document.body.appendChild(fragment)
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
      const rect = createHole(left, top, width, height)
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

    resizeTip()
    recordTip()
  }

  function createHole(left: number, top: number, width: number, height: number) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.id = 'mask-rect'
    rect.setAttribute('x', `${left}`)
    rect.setAttribute('y', `${top}`)
    rect.setAttribute('width', `${width}`)
    rect.setAttribute('height', `${height}`)
    rect.setAttribute('fill', 'black')

    return rect
  }

  function createDragRect(left: number, top: number, width: number, height: number) {
    const dragRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    dragRect.id = 'drag-rect'
    dragRect.setAttribute('x', `${left}`)
    dragRect.setAttribute('y', `${top}`)
    dragRect.setAttribute('width', `${width}`)
    dragRect.setAttribute('height', `${height}`)
    dragRect.setAttribute('fill', 'transparent')
    // 加个虚线边框
    dragRect.setAttribute('stroke', 'orange')
    dragRect.setAttribute('stroke-width', '1')
    dragRect.setAttribute('stroke-dasharray', '5 5')

    return dragRect
  }

  function updateRect(rect: SVGRectElement, left: number, top: number, width: number, height: number) {
    rect.setAttribute('x', `${left}`)
    rect.setAttribute('y', `${top}`)
    rect.setAttribute('width', `${width}`)
    rect.setAttribute('height', `${height}`)
  }

  // 在drag-rect的右下角加一个resize标识
  function resizeTip() {
    resizeBoxDom?.remove()
    resizeBoxDom = document.createElement('div')
    resizeBoxDom.style.cssText = `
      transform: translate(0, 0);
      position: absolute;
      width: 150px;
      height:20px;
      padding: 2px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
      font-size: 12px;
      background-color: rgb(29, 29, 29);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      color: #fff;
    `
    resizeBoxDom.textContent = '↖️ 可拖拽该点改变大小'
    // 找到drag的位置
    const { x, y, width, height } = hole.getBBox()
    resizeBoxDom.style.left = `${x + width}px`
    resizeBoxDom.style.top = `${y + height}px`
    document.body.appendChild(resizeBoxDom)
  }

  // 增加一个计时器
  function timerTip() {
    timerBox = createApp(Timer)
    timerBoxDom = document.createElement('div')
    timerBox.mount(timerBoxDom)

    const holeRect = hole.getBBox()
    timerBoxDom.style.cssText = `
      width: 180px;
      height: 32px;
      position: fixed;
      top: ${holeRect.y + holeRect.height + 36}px;
      left: ${holeRect.x + holeRect.width / 2}px;
      transform: translate(-50%, -100%);
      z-index: 9999;
      background-color: rgb(29, 29, 29);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      border-radius: 4px;
    `
    document.body.appendChild(timerBoxDom)
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
          x: x * scale,
          y: y * scale,
          width: Number(hole.getAttribute('width')) * scale + 2 * scale,
          height: Number(hole.getAttribute('height')) * scale + 2 * scale,
        }
        // 去掉hole的边框颜色
        hole.setAttribute('stroke', 'transparent')
        // 去掉drag的虚线
        drag.setAttribute('stroke', 'transparent')

        // 开始录制
        regionLifeCycle.onStartRecord(recordOptions)
          .then(() => {
            // 首先根据全屏录制还是区域录制来判断是否需要隐藏窗口
            if (currentRecorderType.value === 'window') {
              // window.useRecord.hide()
              regionLifeCycle.onStartFullRecordSuccess()
            }
            else {
              // 需要删掉各种提示框
              resizeBoxDom?.remove()
              recordBoxDom?.remove()
              // 增加计时器
              timerTip()
              // 去掉esc按钮的监听
              document.removeEventListener('keydown', escCallback)
              // 一般情况下需要 告诉窗口让它变成可穿透窗口
              // window.useRecord.transparentClipWin()
              regionLifeCycle.onStartClipRecordSuccess()
            }
            // 其次需要通知index入口的页面来进行图标的改变
            // window.useRecord.message({ type: 'change-icon', msg: 'recording' })
            regionLifeCycle.onStartRecordSuccess()
          })
          .catch(err => alert(err))
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
    document.body.appendChild(recordBoxDom)
  }

  return {
    start,
  }
}
