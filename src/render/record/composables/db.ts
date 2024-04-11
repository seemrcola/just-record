import type { Table } from 'dexie'
import Dexie from 'dexie'

interface RecordData {
  name: string
  data: any
}

class RecordDatabase extends Dexie {
  public recordData!: Table<RecordData, number>

  public constructor() {
    super('RecordDatabase')
    this.version(1).stores({
      recordData: '++id, name, data',
    })
  }
}

// 创建一个数据库，用于存储视频录制数据
const db = new RecordDatabase()

export { db }
