import { reactive } from 'vue'

// ============================================================
// 全局资源库（本会话内共享）
// 流水线「入库」后的素材 + 3D 模型在此存储，供首页 / 看板检索、查看、预览
// ============================================================
export const library = reactive([])

// 入库分类（对应海报资源库输出模块）
export const libraryCategories = [
  { key: 'craft', label: '非遗技艺档案', icon: '🛠️' },
  { key: 'pattern', label: '纹样素材库', icon: '🧵' },
  { key: 'song', label: '山歌语音库', icon: '🎵' },
  { key: 'architecture', label: '建筑数据模块', icon: '🏯' }
]

export function libraryCatLabel(key) {
  return libraryCategories.find((c) => c.key === key)?.label || key
}
export function libraryCatIcon(key) {
  return libraryCategories.find((c) => c.key === key)?.icon || '📦'
}

// AI 识别类型 → 入库分类 的自动映射
export const typeToLibrary = {
  language: 'song',        // 壮族语言 → 山歌语音库
  song: 'song',            // 壮乡山歌 → 山歌语音库
  pattern: 'pattern',      // 服饰纹样 → 纹样素材库
  architecture: 'architecture' // 建筑形制 → 建筑数据模块
}

let seq = 1000
export function addToLibrary(record) {
  seq += 1
  library.unshift({
    id: 'R-' + seq,
    time: new Date().toLocaleString('zh-CN', { hour12: false }),
    ...record
  })
}
