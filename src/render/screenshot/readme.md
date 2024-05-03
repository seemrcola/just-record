### 截图

- 创建一个全屏的蒙板 electron - window
- 截取屏幕的当前帧 贴在蒙板上 electron - capturer
   - draw
   - drag
   - resize

#### 蒙板
1. 拿到宽高
=> 设备的物理像素 （body的宽高是css像素 逻辑像素）
=> 计算出物理像素
=> 传递给api
=> 拿到一个不失真的当前帧截图
=> 传递给renderer进程，渲染到页面上
