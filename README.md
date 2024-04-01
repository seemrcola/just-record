### 仅录制

一个electron应用，用于录制屏幕，并将录制的视频保存到桌面。

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
