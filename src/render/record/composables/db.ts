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

    public async addRecord(name: string, data: any) {
        await this.recordData.add({ name, data })
    }

    public async getAllRecord(name: string) {
        return await this.recordData.where('name').equals(name).toArray()
    }

    public async deleteRecord(name: string) {
        await this.recordData.where('name').equals(name).delete()
    }
}

// 创建一个数据库，用于存储视频录制数据
const db = new RecordDatabase()

export { db }
