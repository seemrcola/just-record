// db的数据结构
interface RecordData {
  name: string
  data: any
}

async function toUnit8Array(blobList: RecordData[]) {
  const recordData = blobList

  const buffer: ArrayBuffer[] = []
  const promiseList: Promise<void>[] = []
  for (let i = 0; i < recordData.length; i++) {
    const reader = new FileReader()
    const blob = recordData[i]
    const p = new Promise<void>((resolve) => {
      reader.readAsArrayBuffer(blob.data)
      reader.onload = () => {
        buffer[i] = reader.result as ArrayBuffer
        resolve()
      }
    })
    promiseList.push(p)
  }

  await Promise.all(promiseList)

    // 将buffer数组处理为一个buffer
  // 定一一个长度为所有buffer的总长度的buffer
  const mergedBuffer = new Uint8Array(buffer.reduce((acc, cur) => acc + cur.byteLength, 0))
  // 将buffer数组合并到一个buffer中
  for (let i = 0, offset = 0; i < recordData.length; i++) {
    // 将buffer数组的每一个buffer拷贝到mergedBuffer中
    mergedBuffer.set(new Uint8Array(buffer[i]), offset)
    offset += buffer[i].byteLength
  }

  return mergedBuffer
}

export {
  toUnit8Array
}
