<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRecorder, useSvgRegion } from './composables'

let stream: MediaStream | null
let fileWritableStream: any
let rectOptions: RecordOptions

const isReplay = ref(false)

onMounted(() => {
    init()
})

const recorder = useRecorder({
    startCallback: () => {},
    stopCallback: () => {},
    dataavailableCallback: (recordData: Blob) => {
        fileWritableStream?.write(recordData)
    },
})

function init() {
    // fixme 这里的开始和结束其实设计的有点问题（但是能用）：
    // 开始是点击record页面的开始按钮 但是停止不是 停止由其他窗口控制 所以这里onStart会通知主进程 而onStop是主进程通知record窗口更新状态
    const { start } = useSvgRegion(
        '#the_mask_wrapper',
        {
            winOnShow: () => { /** todo 可能会需要有什么操作 */ },
            winOnHide: () => window.useRecord.hide(),
            // 点击开始按钮之后要做一些准备工作
            onStartRecord: async (recordOptions: RecordOptions) => {
                rectOptions = recordOptions
                if (rectOptions.fullScreen)
                    await recordFullScreen()
                else
                    await recordClip()
            },
            onStopRecord: (callback: () => void) => {
                window.useRecord.onStopRecord(async () => {
                    callback()

                    recorder.endRecording()
                    fileWritableStream.close()
                    stream?.getTracks().forEach(track => track.stop())
                    stream = null
                    fileWritableStream = null

                    window.useRecord.hide()
                })
            },
            onStartRecordSuccess: async () => {
                window.useRecord.start(rectOptions) // 通知主进程 让主进程通知所有窗口更新状态
            },
            onStartClipRecordSuccess: () => window.useRecord.transparentClipWin(),
            onStartFullRecordSuccess: () => window.useRecord.hide(),
        },
    )
    start()
}

async function recordFullScreen() {
    stream = await getDisplayStream() // 重新获取屏幕流
    const fileHandle = await generateWebmFile() // 生成webm文件
    fileWritableStream = await fileHandle.createWritable() // 创建可写流
    await recorder.startRecording(stream) // 开始录屏
}

async function recordClip() {
    stream = await getDisplayStream() // 重新获取屏幕流
    const fileHandle = await generateWebmFile() // 生成webm文件
    fileWritableStream = await fileHandle.createWritable() // 创建可写流

    // 创建一个canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = rectOptions.width
    canvas.height = rectOptions.height

    // 创建一个video
    const videoElement = document.createElement('video')
    videoElement.srcObject = stream
    videoElement.muted = true
    videoElement.play()

    await nextTick() // 等待video加载完毕

    // 绘制canvas画面
    drawVideoToCanvas(videoElement)
    // 录制canvas流
    const canvasStream = canvas.captureStream()
    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    const combinedStream = recorder.combinedStream(canvasStream, audioStream)
    await recorder.startRecording(combinedStream)

    function drawVideoToCanvas(videoElement: HTMLVideoElement) {
        ctx.drawImage(
            videoElement,
            rectOptions.x,
            rectOptions.y,
            rectOptions.width,
            rectOptions.height,
            0,
            0,
            rectOptions.width,
            rectOptions.height,
        )
        requestAnimationFrame(() => drawVideoToCanvas(videoElement))
    }
}

async function generateWebmFile() {
    /**
     * 这个是用来保存文件的，可以用于创建一个文件
     * 下面这个就是标准用法
     * 文档链接 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showSaveFilePicker
     */
    // @ts-expect-error
    const fileHandle = await window.showSaveFilePicker({
        startIn: 'desktop', // 选择器的初始位置 ['window', 'filesystem', 'downloads', 'desktop', 'videos']
        suggestedName: 'record.webm', // 建议的文件名
        types: [{
            description: 'Video File', // 描述
            accept: { 'video/webm': ['.webm'] }, // 接受的类型
        }],
    })
    return fileHandle
}

async function getDisplayStream() {
    const source = await window.useRecord.getCaptureResource()
    const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            // @ts-expect-error
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            },
        },
    })
    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    const combinedStream = recorder.combinedStream(videoStream, audioStream)
    return combinedStream
}

window.useRecord.onRecordShow(async () => {})
window.useRecord.onRecordHide(async () => {})

onUnmounted(() => {
    recorder?.endRecording()
    fileWritableStream?.close()
    fileWritableStream = null
})
</script>

<template>
    <div w-full h-full>
        <div v-show="!isReplay" id="the_mask_wrapper" w-full h-full flex-center bg-transparent class="mask">
            <!-- svg -->
        </div>
    </div>
</template>

<style scoped>
.mask {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.replay-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
