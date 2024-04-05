import fs from 'node:fs'
import { protocol } from 'electron'

// 注册协议
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-resource',
    privileges: {
      standard: true, // 允许使用标准的协议处理
      secure: true, // 允许使用安全的协议处理
      supportFetchAPI: true, // 允许使用 fetch API
      bypassCSP: true, // 允许绕过 CSP
      stream: true, // 允许使用 stream API
    },
  },
])

function convertPath(originalPath: string) {
  // 检测路径是否以斜杠开头，且之后是单个字母（盘符）跟着一个冒号
  const match = originalPath.match(/^\/([a-zA-Z])\/(.*)$/)
  if (match) {
    // 如果匹配，重构路径为 Windows 格式
    return `${match[1]}:/${match[2]}`
  }
  else {
    // 如果不匹配，返回原始路径
    return originalPath
  }
}

export function protocolHandle() {
  protocol.handle(
    'local-resource',
    (request) => {
      // 解码请求URL，去掉协议部分，以获得原始路径。
      // 这里使用正则表达式将"local-resource:/"替换为空字符串，并解码URL编码。
      const decodedUrl = decodeURIComponent(
        request.url.replace(new RegExp(`^local-resource:/`, 'i'), ''),
      )

      // 打印解码后的URL，以便调试。
      console.log('decodedUrl', decodedUrl)

      // 根据操作系统平台，可能需要转换路径格式。
      // 如果是Windows平台，调用convertPath方法转换路径；否则，直接使用解码后的URL。
      const fullPath
        = process.platform === 'win32' ? convertPath(decodedUrl) : decodedUrl

      // 打印最终的文件路径，以便调试。
      console.log('fullPath', fullPath)

      // 异步读取文件内容。
      const data = fs.readFileSync(fullPath)

      // 将读取的文件内容封装在Response对象中返回。
      // 这允许Electron应用加载和显示来自自定义协议URL的内容。
      return new Response(data)
    },
  )
}
