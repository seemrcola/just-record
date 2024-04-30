export function useDrawRect(dom: HTMLElement) {
  let startflag = false;
  let start = {
    x: 0,
    y: 0
  }

  function startDraw() {
    document.addEventListener('mousedown', mousedownHanlder);
  }

  function mousedownHanlder(e: MouseEvent) {
    e.preventDefault();
    startflag = true;
    start = {
      x: e.pageX,
      y: e.pageY
    }
    console.log('start', start);
    dom.style.left = `${start.x}px`;
    dom.style.top = `${start.y}px`;
    document.addEventListener('mousemove', mousemoveHanlder);
    document.addEventListener('mouseup', mouseupHanlder);
  }

  function mousemoveHanlder(e: MouseEvent) {
    if(!startflag) return;
    e.preventDefault();

    const {pageX, pageY} = e;
    const width = pageX - start.x;
    const height = pageY - start.y;

    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;
  }

  function mouseupHanlder(e: MouseEvent) {
    e.preventDefault();
    startflag = false;
    document.removeEventListener('mousemove', mousemoveHanlder);
    document.removeEventListener('mouseup', mouseupHanlder);
    stopDraw();
  }

  function stopDraw() {
    document.removeEventListener('mousedown', mousedownHanlder);
  }

  return {
    startDraw,
    stopDraw
  }
}
