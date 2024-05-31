import type { useUndo } from './undo'

export {
    useDragSVGLine,
    useDragSVGPolyLine,
    useDragSVGEllipse,
    useDragSVGRect,
}

function useDragSVGLine(
    target: SVGElement,
    parent: SVGElement,
    undo: ReturnType<typeof useUndo>,
) {
    let startFlag = false
    let start = { x: 0, y: 0 }
    let benchmark = { x: 0, y: 0 }

    target.style.cursor = 'pointer'

    target.onmousedown = mousedownHandler
    target.style.position = 'fixed'
    let innerLine: SVGLineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')

    function mousedownHandler(e: MouseEvent) {
        undo.track()

        e.stopPropagation()
        startFlag = true

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHandler)
        start = { x: e.pageX, y: e.pageY }
        benchmark = { x: e.pageX, y: e.pageY }

        flagDrawing()
    }

    function mousemoveHandler(e: MouseEvent) {
        e.stopPropagation()

        if (!startFlag)
            return

        const { pageX, pageY } = e
        const { x, y } = start
        const deltaX = pageX - x
        const deltaY = pageY - y

        // 更新 line 的位置
        updateLine(deltaX, deltaY, innerLine)
        updateLine(deltaX, deltaY, target)

        start = { x: pageX, y: pageY }
    }

    function mouseupHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = false

        innerLine?.remove()

        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHandler)

        // 如果实际没有移动，则不记录 undo
        if (benchmark.x === e.pageX && benchmark.y === e.pageY)
            undo.fallback()
    }

    function flagDrawing() {
        innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        innerLine.setAttribute('style', 'fill:none;stroke:white;stroke-width:1')
        const x1 = target.getAttribute('x1') || '0'
        const y1 = target.getAttribute('y1') || '0'
        const x2 = target.getAttribute('x2') || '0'
        const y2 = target.getAttribute('y2') || '0'
        innerLine.setAttribute('x1', `${x1}`)
        innerLine.setAttribute('y1', `${y1}`)
        innerLine.setAttribute('x2', `${x2}`)
        innerLine.setAttribute('y2', `${y2}`)
        parent.appendChild(innerLine)
    }

    function updateLine(dx: number, dy: number, line: SVGElement) {
        const x1 = Number.parseFloat(line.getAttribute('x1')!)
        const y1 = Number.parseFloat(line.getAttribute('y1')!)
        const x2 = Number.parseFloat(line.getAttribute('x2')!)
        const y2 = Number.parseFloat(line.getAttribute('y2')!)
        line.setAttribute('x1', `${x1 + dx}`)
        line.setAttribute('y1', `${y1 + dy}`)
        line.setAttribute('x2', `${x2 + dx}`)
        line.setAttribute('y2', `${y2 + dy}`)
    }
}

function useDragSVGPolyLine(
    target: SVGElement,
    parent: SVGElement,
    undo: ReturnType<typeof useUndo>,
) {
    let startFlag = false
    let start = { x: 0, y: 0 }
    let benchmark = { x: 0, y: 0 }

    target.style.cursor = 'pointer'

    target.onmousedown = mousedownHandler
    target.style.position = 'fixed'
    let innerLine: SVGPolylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

    function mousedownHandler(e: MouseEvent) {
        undo.track()

        e.stopPropagation()
        startFlag = true

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHandler)
        start = { x: e.pageX, y: e.pageY }
        benchmark = { x: e.clientX, y: e.clientY }

        flagDrawing()
    }

    function mousemoveHandler(e: MouseEvent) {
        e.stopPropagation()

        if (!startFlag)
            return

        const { pageX, pageY } = e
        const { x, y } = start
        const deltaX = pageX - x
        const deltaY = pageY - y

        // 更新 polyline 的位置
        const newPoints = updatePolylinePoints(deltaX, deltaY, target)
        target.setAttribute('points', newPoints)
        innerLine.setAttribute('points', newPoints)

        start = { x: pageX, y: pageY }
    }

    function mouseupHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = false

        innerLine?.remove()

        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHandler)

        // 如果实际没有移动，则不记录 undo
        if (benchmark.x === e.clientX && benchmark.y === e.clientY)
            undo.fallback()
    }

    function flagDrawing() {
        const pointsArray = target.getAttribute('points')!.split(' ')
        innerLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
        innerLine.setAttribute('points', pointsArray.join(' '))
        innerLine.setAttribute('style', 'fill:none;stroke:white;stroke-width:1')
        parent.appendChild(innerLine)
    }

    function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
        const pointsArray = ele.getAttribute('points')!.split(' ')
        const newPointsArray = pointsArray.map((point) => {
            const [x, y] = point.split(',')
            return `${Number.parseFloat(x) + dx},${Number.parseFloat(y) + dy}`
        })

        return newPointsArray.join(' ')
    }
}

function useDragSVGEllipse(
    target: SVGElement,
    parent: SVGElement,
    undo: ReturnType<typeof useUndo>,
) {
    let startFlag = false
    let start = { x: 0, y: 0 }
    let benchmark = { x: 0, y: 0 }

    target.style.cursor = 'pointer'

    let innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')

    target.onmousedown = mousedownHandler
    target.style.position = 'fixed'

    function mousedownHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = true

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHandler)
        start = { x: e.pageX, y: e.pageY }
        benchmark = { x: e.pageX, y: e.pageY }

        undo.track()
        flagDrawing()
    }

    function mousemoveHandler(e: MouseEvent) {
        e.stopPropagation()

        if (!startFlag)
            return

        const { pageX, pageY } = e
        const { x, y } = start
        const deltaX = pageX - x
        const deltaY = pageY - y

        updatePolylinePoints(deltaX, deltaY, innerSvg)
        updatePolylinePoints(deltaX, deltaY, target)

        start = { x: pageX, y: pageY }
    }

    function mouseupHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = false

        innerSvg?.remove()

        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHandler)

        // 如果实际没有移动，则不记录 undo
        if (benchmark.x === e.pageX && benchmark.y === e.pageY)
            undo.fallback()
    }

    function flagDrawing() {
        innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')

        const rx = target.getAttribute('rx') ?? '0'
        const ry = target.getAttribute('ry') ?? '0'
        const cx = target.getAttribute('cx') ?? '0'
        const cy = target.getAttribute('cy') ?? '0'

        innerSvg.setAttribute('rx', `${rx}`)
        innerSvg.setAttribute('ry', `${ry}`)
        innerSvg.setAttribute('cx', `${cx}`)
        innerSvg.setAttribute('cy', `${cy}`)

        innerSvg.setAttribute('style', 'fill:none;stroke:white;stroke-width:1')
        parent.appendChild(innerSvg)
    }

    function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
        const x = Number.parseInt(ele.getAttribute('cx')!)
        const y = Number.parseInt(ele.getAttribute('cy')!)
        ele.setAttribute('cx', `${x + dx}`)
        ele.setAttribute('cy', `${y + dy}`)
    }
}

function useDragSVGRect(
    target: SVGElement,
    parent: SVGElement,
    undo: ReturnType<typeof useUndo>,
) {
    let startFlag = false
    let start = { x: 0, y: 0 }
    let benchmark = { x: 0, y: 0 }

    target.style.cursor = 'pointer'

    let innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

    target.onmousedown = mousedownHandler
    target.style.position = 'fixed'

    function mousedownHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = true

        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('mouseup', mouseupHandler)
        start = { x: e.pageX, y: e.pageY }
        benchmark = { x: e.pageX, y: e.pageY }

        undo.track()
        flagDrawing()
    }

    function mousemoveHandler(e: MouseEvent) {
        e.stopPropagation()

        if (!startFlag)
            return

        const { pageX, pageY } = e
        const { x, y } = start
        const deltaX = pageX - x
        const deltaY = pageY - y

        updatePolylinePoints(deltaX, deltaY, innerSvg)
        updatePolylinePoints(deltaX, deltaY, target)

        start = { x: pageX, y: pageY }
    }

    function mouseupHandler(e: MouseEvent) {
        e.stopPropagation()
        startFlag = false

        innerSvg?.remove()

        document.removeEventListener('mousemove', mousemoveHandler)
        document.removeEventListener('mouseup', mouseupHandler)

        // 如果实际没有移动，则不记录 undo
        if (benchmark.x === e.pageX && benchmark.y === e.pageY)
            undo.fallback()
    }

    function flagDrawing() {
        innerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

        const x = target.getAttribute('x') || '0'
        const y = target.getAttribute('y') || '0'
        const width = target.getAttribute('width') || '0'
        const height = target.getAttribute('height') || '0'

        innerSvg.setAttribute('x', x)
        innerSvg.setAttribute('y', y)
        innerSvg.setAttribute('width', width)
        innerSvg.setAttribute('height', height)

        innerSvg.setAttribute('style', 'fill:none;stroke:white;stroke-width:1')
        parent.appendChild(innerSvg)
    }

    function updatePolylinePoints(dx: number, dy: number, ele: SVGElement) {
        const x = Number.parseInt(ele.getAttribute('x')!)
        const y = Number.parseInt(ele.getAttribute('y')!)
        ele.setAttribute('x', `${x + dx}`)
        ele.setAttribute('y', `${y + dy}`)
    }
}
