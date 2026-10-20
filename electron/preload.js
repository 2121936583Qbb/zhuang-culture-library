// 预加载脚本：通过 contextBridge 向渲染进程暴露最小化 API
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appInfo', {
  name: 'AI驱动的壮族文化数字资源库',
  version: '1.0.0',
  isElectron: true,
  platform: process.platform
})

// 本地持久化 API：模型 / AR 素材数据读写
contextBridge.exposeInMainWorld('storeAPI', {
  load: (key) => ipcRenderer.invoke('store:load', key),
  save: (key, data) => ipcRenderer.invoke('store:save', key, data)
})
