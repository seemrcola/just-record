import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Color, MosaicType, Size } from '../types'

type ToolType = 'Mosaic' | 'Pen' | 'Rect' | 'Ellipse' | 'Text'

export const useToolsStore = defineStore('tools', () => {

  const showMosaicChoose = ref(false)
  const showPenChoose = ref(false)
  const showRectChoose = ref(false)
  const showEllipseChoose = ref(false)
  const showTextChoose = ref(false)
  const showList = [showMosaicChoose, showPenChoose, showRectChoose, showEllipseChoose, showTextChoose]

  // Mosaic
  const mosaicType = ref<MosaicType>('light')
  function setMosaicType(type: MosaicType) {
    mosaicType.value = type
  }
  // Pen
  const penSize = ref<Size>('small')
  const penColor = ref<Color>('red')
  function setPenSize(size: Size) {
    penSize.value = size
  }
  function setPenColor(color: Color) {
    penColor.value = color
  }
  // Rect
  const rectColor = ref<Color>('red')
  function setRectColor(color: Color) {
    rectColor.value = color
  }
  // Ellipse
  const ellipseColor = ref<Color>('red')
  function setEllipseColor(color: Color) {
    ellipseColor.value = color
  }
  // Text
  const textSize = ref<Size>('small')
  const textColor = ref<Color>('red')
  function setTextColor(color: Color) { 
    textColor.value = color
  }
  function setTextSize(size: Size) {
    textSize.value = size
  }

  // Show Choose
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
      case 'Text':
        showTextChoose.value = true
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
    textColor,
    setTextColor,
    textSize,
    setTextSize,

    showMosaicChoose,
    showPenChoose,
    showRectChoose,
    showEllipseChoose,
    showTextChoose,
    changeShowChoose,

    clear,
  }
})
