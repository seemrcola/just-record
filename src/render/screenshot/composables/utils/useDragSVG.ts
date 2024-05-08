export function useDragSVG(
  target: SVGElement,
  parent: SVGElement
) {
  let startFlag = false
  let start = { x: 0, y: 0 }

  target.addEventListener('mousedown', mousedownHandler)
  target.style.position = 'fixed'
  let innerLine: SVGPolylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

  function mousedownHandler(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startFlag = true
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
    start = { x: e.pageX, y: e.pageY }
    flagDrawing()
  }

  function mousemoveHandler(e: MouseEvent) {
    if (!startFlag)
      return

    const { pageX, pageY } = e
    const { x, y } = start
    const deltaX = pageX - x
    const deltaY = pageY - y

    // 更新 polyline 的位置
    const newPoints = updatePolylinePoints(deltaX, deltaY, target);
    target.setAttribute('points', newPoints);
    innerLine.setAttribute('points', newPoints);

    start = { x: pageX, y: pageY }
  }

  function mouseupHandler(e: MouseEvent) {
    startFlag = false
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)
    innerLine.remove();
  }

  function flagDrawing() {
    const pointsArray = target.getAttribute('points')!.split(' ');
    innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    innerLine.setAttribute('points', pointsArray.join(' '));
    innerLine.setAttribute('style', 'fill:none;stroke:white;stroke-width:1');
    parent.appendChild(innerLine);
  }

  function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
    const pointsArray = ele.getAttribute('points')!.split(' ');
    const newPointsArray = pointsArray.map(point => {
      const [x, y] = point.split(',');
      return `${parseFloat(x) + dx},${parseFloat(y) + dy}`;
    });

    return newPointsArray.join(' ');
  }
}
