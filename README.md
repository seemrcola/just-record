## electron-vite-recorder
写个electron玩具 用来学习vite和electron

###  todo
- 处理express服务的port传递给render线程、
- 视频播放的control组件 播放暂停/进度控制/音量控制/控制条一段时间不操作会自动消失
- 修复录制范围不准确的问题（fixed）
- 修复二次打开窗口时svg hole的残影问题（fixed）

### bug
- 自从全屏之后 停止运行代码之后electron会占着进程不会退出 只能强制退出
