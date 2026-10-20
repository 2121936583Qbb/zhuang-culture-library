import { reactive } from 'vue'
import { categories, models3d, arResources } from './mock.js'

// ============================================================
// 全局资源库（本会话内共享，供首页 / 看板展示入库成果）
// ============================================================
export const library = reactive([])

// 入库分类：与 mock 的 6 大分类统一（壮族语言/壮乡山歌/服饰纹样/建筑形制/节庆习俗/传统技艺）
export const libraryCategories = categories

export function libraryCatLabel(key) {
  return categories.find((c) => c.key === key)?.label || key
}
export function libraryCatIcon(key) {
  return categories.find((c) => c.key === key)?.icon || '📦'
}

// AI 识别类型 → 分类（6 分类统一）
export const typeToLibrary = {
  language: 'language',
  song: 'song',
  pattern: 'pattern',
  architecture: 'architecture'
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

// ============================================================
// 本地持久化：优先 Electron IPC 写文件（userData），退回 localStorage / 内存
// ============================================================
async function loadSlot(key) {
  try {
    if (window.storeAPI) return await window.storeAPI.load(key)
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}
function saveSlot(key, data) {
  try {
    const snapshot = JSON.parse(JSON.stringify(data))
    if (window.storeAPI) window.storeAPI.save(key, snapshot)
    else localStorage.setItem(key, JSON.stringify(snapshot))
  } catch (e) { /* 忽略持久化失败，内存仍可用 */ }
}

// ============================================================
// 三维模型库（供「三维模型管理」页动态读取）
// ============================================================
export const models = reactive(models3d.map((m) => ({ ...m })))

;(async function loadModels() {
  const d = await loadSlot('zc_models')
  if (Array.isArray(d) && d.length) models.splice(0, models.length, ...d)
})()

export function addModel(model) {
  models.unshift(model)
  saveSlot('zc_models', models)
}
export function updateModelStatus(id, status) {
  const m = models.find((x) => x.id === id)
  if (m) { m.status = status; saveSlot('zc_models', models) }
}

// ============================================================
// AR 教学素材库（供「AR教学数据」页动态读取）
// ============================================================
export const arMaterials = reactive(arResources.map((a) => ({ ...a })))

;(async function loadArMaterials() {
  const d = await loadSlot('zc_ar')
  if (Array.isArray(d) && d.length) arMaterials.splice(0, arMaterials.length, ...d)
})()

export function addArMaterial(material) {
  arMaterials.unshift(material)
  saveSlot('zc_ar', arMaterials)
}
export function updateArStatus(id, status) {
  const a = arMaterials.find((x) => x.id === id)
  if (a) { a.status = status; saveSlot('zc_ar', arMaterials) }
}
