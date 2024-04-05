// ffmpeg
import os from 'node:os'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'

// ffmpeg.setFfmpegPath(ffmpegPath.path)
// ffmpeg.setFfprobePath(ffprobePath.path)

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'))
ffmpeg.setFfprobePath(ffprobePath.path.replace('app.asar', 'app.asar.unpacked'))

const dir = `${os.homedir()}/Desktop`

export function useFFMPEG() {
  let ffcommand: ffmpeg.FfmpegCommand

  function startRecord(recordOptions: RecordOptions) {
    // 1. 采集桌面/桌面区域
    const type = recordOptions.fullScreen ? 'window' : 'area'
    const filename = `${dir}/record-output-${Date.now()}.mp4`

    //   ffmpeg -f avfoundation \                    // 采集桌面
    //   -capture_cursor 1 \                         // 捕获鼠标
    //   -i "1" \                                    // 采集设备 1的意思是采集屏幕
    //   -video_size ${width}x${height} \            // 视频尺寸
    //   -vf "crop=${width}:${height}:${x}:${y}" \   // 从屏幕的x,y坐标开始裁剪
    //   -c:v libx264 \                              // 编码格式
    //   -r 30 \                                     // 帧率
    //   -preset ultrafast ~/desktop/${filename}     // 输出文件

    ffcommand = ffmpeg({ source: '1:0' })

    if (type === 'window') {
      ffcommand
        .inputFormat('avfoundation')
        .fps(30)
        .videoCodec('libx264')
        .videoBitrate('2000k')
        .output(`${filename}`)
        .run()
    }
    else {
      const { width, height, x, y } = recordOptions
      ffcommand
        .inputFormat('avfoundation')
        .fps(30)
        .videoCodec('libx264')
        .videoBitrate('2000k')
        .videoFilter(`crop=${width}:${height}:${x}:${y}`)
        .output(`${filename}`)
        .run()
    }

    return filename
  }

  function stopRecord() {
    // 停止录制
    return new Promise((resolve) => {
      ffcommand
        .on('end', () => {
          console.log('Finished recording')
          resolve(true)
        })
        .on('error', (err) => {
          console.log('Error:', err)
          resolve(false)
        })
        .kill('SIGINT')
    })
  }

  function pauseRecord() {
    // 暂停录制
    ffcommand.kill('SIGSTOP')
  }

  function resumeRecord() {
    // 继续录制
    ffcommand.kill('SIGCONT')
  }

  return {
    startRecord,
    stopRecord,
    pauseRecord,
    resumeRecord,
  }
}
