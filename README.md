### 仅录制

一个electron应用，用于录制屏幕，并将录制的视频保存到桌面。支持区域录制和全屏录制。

### 使用
```
pnpm install
```

```
pnpm build
```
### 更改图标

在`build`文件夹下找到`icon.png`文件，替换掉`build/icon.png`文件即可。
必须要生成一个至少 512x512px 的图标。可以使用ffmpeg等工具进行转换。
```
ffmpeg -i input.jpg -vf "scale=512:512" output.jpg
```

### 打包体积
目前我将渲染进程的依赖写入了`package.json`的`devDependencies`字段。
只有主进程的依赖才应该放在`dependencies`字段。


### 灵感来自
https://github.com/027xiguapi/pear-rec
仅实现这个项目的其中一个小功能，即录制功能。

### bug
- 目前打包还存在问题  无法开启录制
