import WebMWriter from './webm-writer2.js'

let webmWriter = null;
let fileWritableStream = null;
let frameReader = null;

async function startRecording(fileHandle, frameStream, trackSettings) {
  let frameCounter = 0;

  // 来自window.showSaveFilePicker 返回一个句柄
  // 这个句柄可以用来写入文件
  // https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileHandle
  fileWritableStream = await fileHandle.createWritable();

  // 创建一个WebMWriter对象，用来写入WebM文件 这个文件后续再细看
  webmWriter = new WebMWriter({
    fileWriter: fileWritableStream,
    codec: 'VP9',
    width: trackSettings.width,
    height: trackSettings.height
  });

  // 根据frameStream创建一个ReadableStreamReader对象，用来读取帧数据
  frameReader = frameStream.getReader();

  const init = {
    // 当编码帧完成之后调用这个函数 用于写入WebM文件
    output: (chunk) => {
      webmWriter.addFrame(chunk);
    },
    error: (e) => {
      console.log(e.message);
      stopRecording();
    }
  };

  const config = {
    codec: "vp09.00.10.08",
    width: trackSettings.width,
    height: trackSettings.height,
    bitrate: 30e6,
  };

  // 创建一个VideoEncoder对象，用来编码帧数据
  let encoder = new VideoEncoder(init);
  let support = await VideoEncoder.isConfigSupported(config);
  console.assert(support.supported);
  // 配置编码器
  encoder.configure(config);

  // 开始编码帧数据
  frameReader.read().then(async function processFrame({ done, value }) {
    let frame = value;

    if (done) {
      await encoder.flush();
      encoder.close();
      return;
    }

    // 当编码器队列中的帧数小于30时，将帧数据编码并写入WebM文件
    if (encoder.encodeQueueSize <= 30) {
      // 当帧数是20的倍数时，打印日志
      if (++frameCounter % 20 == 0) {
        console.log(frameCounter + ' frames processed');
      }
      // 每隔150帧插入一个关键帧
      const insert_keyframe = (frameCounter % 150) == 0;
      encoder.encode(frame, { keyFrame: insert_keyframe });
    } else {
      console.log('dropping frame, encoder falling behind');
    }

    // 关闭帧数据 释放内存
    frame.close();
    // 读取下一帧数据
    frameReader.read().then(processFrame);
  });
}

async function stopRecording() {
  await frameReader.cancel();
  await webmWriter.complete();
  fileWritableStream.close();
  frameReader = null;
  webmWriter = null;
  fileWritableStream = null;
}

self.addEventListener('message', function (e) {
  switch (e.data.type) {
    case "start":
      startRecording(e.data.fileHandle, e.data.frameStream, e.data.trackSettings);
      break;
    case "stop":
      stopRecording();
      break;
  }
});

