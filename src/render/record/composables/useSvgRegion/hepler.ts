function createholeRect(left: number, top: number, width: number, height: number) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.id = 'mask-rect'
  rect.setAttribute('x', `${left}`)
  rect.setAttribute('y', `${top}`)
  rect.setAttribute('width', `${width}`)
  rect.setAttribute('height', `${height}`)
  rect.setAttribute('fill', 'black')

  return rect
}

function createDragRect(left: number, top: number, width: number, height: number) {
  const dragRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  dragRect.id = 'drag-rect'
  dragRect.setAttribute('x', `${left}`)
  dragRect.setAttribute('y', `${top}`)
  dragRect.setAttribute('width', `${width}`)
  dragRect.setAttribute('height', `${height}`)
  dragRect.setAttribute('fill', 'transparent')
  // 加个虚线边框
  dragRect.setAttribute('stroke', 'orange')
  dragRect.setAttribute('stroke-width', '2')
  dragRect.setAttribute('stroke-dasharray', '10 5')

  return dragRect
}

function updateRect(rect: SVGRectElement, left: number, top: number, width: number, height: number) {
  rect.setAttribute('x', `${left}`)
  rect.setAttribute('y', `${top}`)
  rect.setAttribute('width', `${width}`)
  rect.setAttribute('height', `${height}`)
}

export {
  createholeRect,
  createDragRect,
  updateRect,
}
