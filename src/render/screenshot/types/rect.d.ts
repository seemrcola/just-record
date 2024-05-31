export type Position
    = 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'

// init : 初始状态
// draw : 绘制状态
// drag : 拖动状态
// resize : 缩放状态
// edit : 编辑状态
export type Mode = 'init' | 'draw' | 'drag' | 'resize' | 'edit'
