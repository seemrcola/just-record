// 这个文件是用来实现录屏的功能的，主要是使用 MediaRecorder API 来实现录屏的功能。
const Kbps = 1000;

export function useRecorder(sliceTime = 1000) {
  let mediaRecorder: MediaRecorder | null = null;
  let blobList: Blob[] = [];

  // 获取音频流
  async function getAudioStream() {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return audioStream;
  }

  // 获取屏幕流id
  async function getScreenSource() {
    const source = await window.useRecord.getCaptureResource();
    console.log('source', source)
    return source;
  }

  async function getDisplayMedia(sourceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
        },
      },
    });
    return stream;
  }
  
  // 获取屏幕流
  async function startRecording(options: MediaRecorderOptions = {
    mimeType: 'video/webm;codecs=vp8',
    videoBitsPerSecond: 2000 * Kbps,
  }) {
    // 将音频流合进来
    const audioStream = await getAudioStream();
    const source = await getScreenSource();
    const displayStream = await getDisplayMedia(source.id);
    console.log('displayStream', displayStream)

    const combinedStream = new MediaStream([...displayStream.getTracks(),...audioStream.getTracks()]);
    mediaRecorder = new MediaRecorder(displayStream, options);
    mediaRecorderListeners();
    mediaRecorder.start(sliceTime);

    mediaRecorder.addEventListener('stop', () => {
      mediaRecorder?.stream.getTracks().forEach(track => track.stop());
      displayStream.getTracks().forEach(track => track.stop());
      audioStream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
      download(blobList)
    });
  }
  
  function endRecording() {
    if(mediaRecorder?.state === 'recording')
      mediaRecorder?.stop();
  }

  function mediaRecorderListeners() {
    mediaRecorder?.addEventListener('dataavailable', e => {
      if (e.data.size > 0) 
        blobList.push(e.data);
      console.log('dataavailable', e.data.size)
    })
  }

  function download(blobList: Blob[]) {
    const blob = new Blob(blobList, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video.webm';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  
  return {
    startRecording,
    endRecording,
    mediaRecorder,
    blobList
  }
}
