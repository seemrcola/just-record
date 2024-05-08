import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Color, MosaicType, Size } from '../types'

type ToolType = 'Mosaic' | 'Pen' | 'Rect' | 'Ellipse'

export const useToolsStore = defineStore('tools', () => {
  const mosaicType = ref<MosaicType>('light')

  const showMosaicChoose = ref(false)
  const showPenChoose = ref(false)
  const showRectChoose = ref(false)
  const showEllipseChoose = ref(false)
  const showList = [showMosaicChoose, showPenChoose, showRectChoose, showEllipseChoose]

  const penSize = ref<Size>('small')
  const penColor = ref<Color>('red')
  const rectColor = ref<Color>('red')
  const ellipseColor = ref<Color>('red')

  function setMosaicType(type: MosaicType) {
    mosaicType.value = type
  }

  function setPenSize(size: Size) {
    penSize.value = size
  }
  function setPenColor(color: Color) {
    penColor.value = color
  }

  function setRectColor(color: Color) {
    rectColor.value = color
  }

  function setEllipseColor(color: Color) {
    ellipseColor.value = color
  }

  function changeShowChoose(type: ToolType) {
    showList.forEach(show => show.value = false)
    switch (type) {
      case 'Mosaic':
        showMosaicChoose.value = true
        break
      case 'Pen':
        showPenChoose.value = true
        break
      case 'Rect':
        showRectChoose.value = true
        break
      case 'Ellipse':
        showEllipseChoose.value = true
        break

      default:
        break
    }
  }

  function clear() {
    showList.forEach(show => show.value = false)
  }

  return {
    mosaicType,
    setMosaicType,
    penSize,
    setPenSize,
    penColor,
    setPenColor,
    rectColor,
    setRectColor,
    ellipseColor,
    setEllipseColor,

    showMosaicChoose,
    showPenChoose,
    showRectChoose,
    showEllipseChoose,
    changeShowChoose,

    clear,
  }
})
