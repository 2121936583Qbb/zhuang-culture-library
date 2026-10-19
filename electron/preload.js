// 预加载脚本：通过 contextBridge 向渲染进程暴露最小化的只读信息
// 本演示系统纯前端 Mock，无需真实 Node 能力，这里仅用于示例
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('appInfo', {
  name: 'AI驱动的壮族文化数字资源库',
  version: '1.0.0',
  isElectron: true,
  platform: process.platform
})
