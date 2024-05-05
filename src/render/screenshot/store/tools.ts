import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MosaicType } from '../types'

export const useMosaicStore = defineStore('tools', () => {
  const mosaicType = ref<MosaicType>('light')

  function setMosaicType(type: MosaicType) {
    mosaicType.value = type
  }

  return {
    mosaicType,
    setMosaicType
  }
})
