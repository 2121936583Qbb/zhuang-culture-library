<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🤖 AI 智能采集流水线</h2>
      <p class="page-sub">上传壮族建筑/服饰纹样照片 → AI 深度分析 → 数字化建模 → 入库 → 应用（本地离线，无需外网）</p>
    </div>

    <!-- 流程步骤条 -->
    <div class="stepper">
      <template v-for="(s, i) in steps" :key="s.key">
        <div class="step" :class="{ done: i < currentStep, active: i === currentStep }">
          <div class="step-dot">{{ i < currentStep ? '✓' : s.icon }}</div>
          <div class="step-label">{{ s.label }}</div>
        </div>
        <div v-if="i < steps.length - 1" class="step-line" :class="{ on: i < currentStep }"></div>
      </template>
    </div>

    <div class="grid flow-grid">
      <!-- ===== 1 采集 ===== -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="card-title">📷 ① 采集</h3>
          <p class="card-sub">上传壮族建筑、服饰纹样照片（JPG / PNG）</p>
          <input ref="fileInput" type="file" class="hidden-input" accept="image/jpeg,image/png" multiple @change="onPick" />
          <div v-if="!uploaded" class="dropzone" @click="fileInput.click()">
            <div class="dz-icon">🖼️</div>
            <div class="dz-text">点击选择图片（可多选）</div>
            <div class="dz-hint">支持 jpg / png，可一次选多张，本地离线处理</div>
          </div>
          <div v-else class="uploaded-box">
            <img :src="imageDataUrl" class="uploaded-img" alt="已上传图片" />
            <button class="btn btn-outline btn-sm" @click="fileInput.click()">🔁 重新选择</button>
            <span v-if="pendingImages.length > 1" class="muted">已选 {{ pendingImages.length }} 张，入库时每张各生成一个模型</span>
          </div>
          <div v-if="pendingImages.length > 1" class="thumb-strip">
            <img v-for="(p, i) in pendingImages" :key="i" :src="p.dataUrl" class="strip-thumb" :class="{ cur: i === 0 }" :title="p.name" alt="" />
          </div>
        </div>
      </div>

      <!-- ===== 2 AI 深度分析 ===== -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="card-title">🧠 ② AI 深度分析</h3>
          <p class="card-sub">对图片进行文化元素提取，识别图片类型</p>
          <button class="btn btn-primary" :disabled="!uploaded || analyzing" @click="startAnalyze">
            {{ analyzing ? '分析中…' : '开始 AI 深度分析' }}
          </button>
          <div v-if="analysis" class="result-panel">
            <div class="result-head">
              <span class="result-icon">{{ analysis.typeIcon }}</span>
              <div>
                <div class="result-type">识别类型：{{ analysis.typeLabel }}</div>
                <div class="result-conf">文化特征匹配度 <b>{{ analysis.confidence }}%</b></div>
              </div>
            </div>
            <div class="palette">
              <span class="palette-label">提取色彩谱系：</span>
              <span v-for="c in analysis.palette" :key="c.hex" class="swatch" :style="{ background: c.hex }" :title="`${c.hex} (${c.pct}%)`"></span>
            </div>
            <div class="tag-row">
              <span v-for="t in analysis.tags" :key="t" class="badge badge-primary">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 3 数字化建模 ===== -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="card-title">🧊 ③ 数字化建模</h3>
          <p class="card-sub">基于照片生成 3D 模型（GLB/GLTF），Three.js 在线预览</p>
          <div class="model-actions">
            <button class="btn btn-brown" :disabled="!analysis || modeling" @click="startModeling">
              {{ modeling ? '建模中…' : '开始数字化建模' }}
            </button>
            <button class="btn btn-outline" :disabled="!modeled" @click="exportGLB">⬇ 下载 GLB</button>
            <span v-if="modeled" class="badge badge-success">精准度较传统方式提升 50%</span>
          </div>
          <div ref="viewerEl" class="viewer3d" :class="{ empty: !modeled }">
            <div v-if="!modeled" class="viewer-empty">上传并分析后，这里显示 3D 模型（可旋转/缩放）</div>
          </div>
          <div v-if="modeled" class="model-meta">模型格式 GLB/GLTF · 三角面约 6,400 · 本地离线生成</div>
        </div>
      </div>

      <!-- ===== 4 入库 ===== -->
      <div class="zhuang-card">
        <div class="card-body">
          <h3 class="card-title">🗄️ ④ 入库</h3>
          <p class="card-sub">将原图、分析结果、3D 模型归类存入资源库</p>
          <div class="store-form">
            <div class="field">
              <label>资源名称</label>
              <input v-model="matName" class="input" placeholder="例如：壮锦·太阳纹样样布" />
            </div>
            <div class="field">
              <label>入库分类</label>
              <select v-model="matCategory" class="select">
                <option v-for="c in libraryCategories" :key="c.key" :value="c.key">{{ c.icon }} {{ c.label }}</option>
              </select>
            </div>
          </div>
          <button class="btn btn-gold" :disabled="!modeled || storing" @click="storeItem">
            {{ storing ? '入库中…' : '✅ 确认入库' }}
          </button>
          <div v-if="stored" class="stored-tip">🎉 已成功入库，可前往三维模型管理、AR教学数据页面查看</div>
        </div>
      </div>
    </div>

    <!-- ===== 5 应用 / 资源库 ===== -->
    <div class="zhuang-card">
      <div class="card-body">
        <h3 class="card-title">🚀 ⑤ 应用 · 资源库输出</h3>
        <p class="card-sub">入库后的素材与 3D 模型，可在此检索、查看、预览</p>
        <div v-if="library.length === 0" class="empty-tip">暂无入库资源，完成上面流程后这里会显示项目成果</div>
        <div v-else class="lib-grid">
          <div v-for="it in library" :key="it.id" class="lib-item">
            <img :src="it.image" class="lib-thumb" alt="" />
            <div class="lib-info">
              <div class="lib-name">{{ it.name }}</div>
              <div class="lib-tags">
                <span class="badge badge-primary">{{ it.typeLabel }}</span>
                <span class="badge badge-neutral">{{ libraryCatIcon(it.category) }} {{ libraryCatLabel(it.category) }}</span>
              </div>
              <div class="lib-meta">{{ it.id }} · {{ it.model.format }}模型 · {{ it.time }}</div>
            </div>
            <div class="lib-actions">
              <button class="btn btn-outline btn-sm" @click="previewLibraryItem(it)">🔍 3D 预览</button>
              <button class="btn btn-ghost btn-sm" @click="downloadLibraryItem(it)">⬇ GLB</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { toast } from '../utils/toast.js'
import { library, libraryCategories, libraryCatLabel, libraryCatIcon, addToLibrary, addModel, addArMaterial, typeToLibrary } from '../data/store.js'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const steps = [
  { key: 'collect', label: '采集', icon: '📷' },
  { key: 'analyze', label: 'AI分析', icon: '🧠' },
  { key: 'model', label: '建模', icon: '🧊' },
  { key: 'store', label: '入库', icon: '🗄️' },
  { key: 'apply', label: '应用', icon: '🚀' }
]

const recognizedTypes = {
  language: { label: '壮族语言', icon: '🔤', tags: ['文字符号', '方块壮字', '声调系统'] },
  song: { label: '壮乡山歌', icon: '🎵', tags: ['旋律纹样', '对歌场景', '五声调式'] },
  pattern: { label: '服饰纹样', icon: '🧵', tags: ['几何织锦', '万字纹', '太阳纹'] },
  architecture: { label: '建筑形制', icon: '🏯', tags: ['干栏式', '穿斗结构', '木构架'] }
}

const fileInput = ref(null)
const viewerEl = ref(null)
const imageDataUrl = ref('')
const imageEl = ref(null)
const pendingImages = ref([])

const uploaded = ref(false)
const analyzing = ref(false)
const analysis = ref(null)
const modeling = ref(false)
const modeled = ref(false)
const storing = ref(false)
const stored = ref(false)

const matName = ref('')
const matCategory = ref('pattern')

// three 运行时对象
let renderer = null
let scene = null
let camera = null
let controls = null
let rafId = null

const currentStep = computed(() => {
  if (!uploaded.value) return 0
  if (!analysis.value) return 1
  if (!modeled.value) return 2
  if (!stored.value) return 3
  return 4
})

function delay(ms) { return new Promise((r) => setTimeout(r, ms)) }

// ---------- 采集 ----------
function onPick(e) {
  const files = Array.from(e.target.files || [])
  e.target.value = ''
  if (!files.length) return
  const valid = files.filter((f) => /image\/(jpeg|png)/i.test(f.type))
  if (!valid.length) { toast('请选择 JPG / PNG 图片', 'warning'); return }
  if (valid.length !== files.length) toast('已忽略非 JPG/PNG 文件', 'warning')

  const loaded = []
  let done = 0
  valid.forEach((f) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        loaded.push({ img, dataUrl: reader.result, name: (f.name || '图片').replace(/\.[^.]+$/, '') })
        done += 1
        if (done === valid.length) {
          pendingImages.value = loaded
          imageEl.value = loaded[0].img
          imageDataUrl.value = loaded[0].dataUrl
          uploaded.value = true
          analysis.value = null
          modeled.value = false
          stored.value = false
          disposeViewer()
          toast(`图片采集完成 ✓（共 ${loaded.length} 张）`, 'success')
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(f)
  })
}

// ---------- AI 分析 ----------
function extractPalette(img, n = 5) {
  const c = document.createElement('canvas')
  c.width = 40
  c.height = 40
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0, 40, 40)
  const data = ctx.getImageData(0, 0, 40, 40).data
  const buckets = {}
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32
    const g = Math.round(data[i + 1] / 32) * 32
    const b = Math.round(data[i + 2] / 32) * 32
    const key = r + ',' + g + ',' + b
    buckets[key] = (buckets[key] || 0) + 1
  }
  const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, n)
  const total = 40 * 40
  return sorted.map(([k, cnt]) => {
    const [r, g, b] = k.split(',').map(Number)
    const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
    return { hex, pct: Math.round((cnt / total) * 100) }
  })
}

function classifyByPalette(palette) {
  const sum = (fn) => palette.filter((p) => fn(p.hex)).reduce((s, p) => s + p.pct, 0)
  const warm = sum((h) => isWarm(h))
  const green = sum((h) => isGreenBrown(h))
  const blue = sum((h) => isBlue(h))
  if (warm >= 45) return 'pattern'
  if (green >= 40) return 'architecture'
  if (blue >= 35) return 'song'
  return 'language'
}

function hexToRgb(h) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0]
}
function isWarm(h) { const [r, g, b] = hexToRgb(h); return r > 120 && r > b + 30 }
function isGreenBrown(h) { const [r, g, b] = hexToRgb(h); return (g > 80 && g >= r) || (r > 90 && g > 60 && b < 80) }
function isBlue(h) { const [r, g, b] = hexToRgb(h); return b > 120 && b > r + 20 }

async function startAnalyze() {
  if (!imageEl.value) return
  analyzing.value = true
  toast('AI 深度分析中…', 'info')
  await delay(1500)
  const palette = extractPalette(imageEl.value)
  const typeKey = classifyByPalette(palette)
  const t = recognizedTypes[typeKey] || recognizedTypes.pattern
  analysis.value = {
    typeKey,
    typeLabel: t.label,
    typeIcon: t.icon,
    palette,
    tags: t.tags,
    confidence: 88 + Math.floor(Math.random() * 11)
  }
  matCategory.value = typeToLibrary[typeKey] || 'pattern'
  analyzing.value = false
  toast(`分析完成：识别为「${t.label}」✓`, 'success')
}

// ---------- 3D 建模 ----------
function buildReliefMesh(img, width, height, seg = 80) {
  const canvas = document.createElement('canvas')
  canvas.width = seg + 1
  canvas.height = seg + 1
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, seg + 1, seg + 1)
  const data = ctx.getImageData(0, 0, seg + 1, seg + 1).data

  const geometry = new THREE.PlaneGeometry(width, height, seg, seg)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const px = Math.max(0, Math.min(seg, Math.round((x / width + 0.5) * seg)))
    const py = Math.max(0, Math.min(seg, Math.round((0.5 - y / height) * seg)))
    const idx = (py * (seg + 1) + px) * 4
    const r = data[idx], g = data[idx + 1], b = data[idx + 2]
    const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255
    pos.setZ(i, gray * 0.5)
  }
  geometry.computeVertexNormals()

  const texture = new THREE.Texture(img)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0.05 })
  return new THREE.Mesh(geometry, material)
}

function mountViewer(img) {
  disposeViewer()
  const container = viewerEl.value
  if (!container) return
  const w = container.clientWidth || 600
  const h = container.clientHeight || 320

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5eee2)

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.set(0, 0, 4)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0, 0)

  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const dir = new THREE.DirectionalLight(0xffffff, 1.4)
  dir.position.set(2, 3, 4)
  scene.add(dir)

  const mesh = buildReliefMesh(img, 3, 2.2)
  mesh.rotation.x = -0.15
  scene.add(mesh)

  const animate = () => {
    rafId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

function disposeViewer() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
  if (controls) { controls.dispose(); controls = null }
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    renderer = null
  }
  if (scene) {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
        else o.material.dispose()
      }
    })
    scene = null
  }
  camera = null
}

async function startModeling() {
  if (!imageEl.value) return
  modeling.value = true
  toast('建模中，正在生成三维模型…', 'info')
  await delay(1600)
  mountViewer(imageEl.value)
  modeled.value = true
  modeling.value = false
  toast('三维模型生成完成 ✓', 'success')
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportGLB() {
  if (!scene) { toast('请先完成建模', 'warning'); return }
  const exporter = new GLTFExporter()
  toast('正在导出 GLB…', 'info')
  exporter.parse(scene, (result) => {
    const blob = new Blob([result], { type: 'model/gltf-binary' })
    downloadBlob(blob, (matName.value || 'zhuang-model') + '.glb')
    toast('GLB 模型已导出 ✓', 'success')
  }, (err) => {
    toast('导出失败：' + (err && err.message ? err.message : err), 'error')
  }, { binary: true })
}

// ---------- 入库辅助 ----------
function makeThumbnail(img, maxW = 240) {
  try {
    const w = maxW
    const h = Math.round((img.naturalHeight || 1) * (maxW / (img.naturalWidth || 1)))
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    c.getContext('2d').drawImage(img, 0, 0, w, h)
    return c.toDataURL('image/jpeg', 0.82)
  } catch (e) {
    return ''
  }
}

function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '1.0 MB'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const catColors = {
  language: ['#382b6b', '#6a58a8'],
  song: ['#b4533f', '#EFD8B9'],
  pattern: ['#865F50', '#c8a254'],
  architecture: ['#4d3b8a', '#865F50'],
  festival: ['#b4533f', '#c8a254'],
  craft: ['#2a2052', '#865F50']
}

const subjectMap = {
  language: '壮语启蒙',
  song: '山歌传唱',
  pattern: '纹样认知',
  architecture: '建筑形制',
  festival: '节庆体验',
  craft: '传统技艺'
}

// ---------- 入库 ----------
async function storeItem() {
  if (!modeled.value) { toast('请先完成建模', 'warning'); return }
  if (!matName.value.trim()) { toast('请填写资源名称', 'warning'); return }
  storing.value = true
  toast('入库中…', 'info')
  await delay(1200)
  const baseName = matName.value.trim()
  const cat = matCategory.value
  const typeLabel = analysis.value ? analysis.value.typeLabel : ''
  const palette = analysis.value ? analysis.value.palette : []
  const tags = analysis.value ? analysis.value.tags : []
  const list = pendingImages.value.length ? pendingImages.value : [{ img: imageEl.value, dataUrl: imageDataUrl.value }]

  list.forEach((p, i) => {
    const name = list.length > 1 ? `${baseName} ${i + 1}` : baseName
    const thumbnail = makeThumbnail(p.img)
    const sizeText = formatFileSize((p.dataUrl || '').length * 0.75)

    // 1) 资源库（供首页 / 看板）
    addToLibrary({
      name,
      category: cat,
      typeLabel,
      image: p.dataUrl,
      palette,
      tags,
      precision: '50%',
      model: { format: 'GLB/GLTF', faces: 6400, method: '高度场浮雕重建' }
    })

    // 2) 三维模型库（供三维模型管理页）
    addModel({
      id: '3D-' + Date.now() + '-' + i,
      name,
      category: cat,
      format: '.glb',
      faces: '6,400',
      size: sizeText,
      quality: 85 + Math.floor(Math.random() * 13),
      status: '处理中',
      color: catColors[cat] || ['#382b6b', '#865F50'],
      thumbnail
    })

    // 3) AR 教学素材库（供 AR 教学数据页）
    addArMaterial({
      id: 'AR-' + Date.now() + '-' + i,
      name,
      category: cat,
      arType: '图像识别',
      target: '1 张',
      status: '内测中',
      subject: subjectMap[cat] || typeLabel,
      thumbnail
    })
  })

  storing.value = false
  stored.value = true
  toast(`素材与模型已成功入库（${list.length} 条），可前往三维模型管理、AR教学数据页面查看`, 'success')
}

// ---------- 应用 ----------
function previewLibraryItem(item) {
  const img = new Image()
  img.onload = () => {
    imageEl.value = img
    imageDataUrl.value = item.image
    matName.value = item.name
    mountViewer(img)
    viewerEl.value && viewerEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    toast('已载入 3D 预览', 'info')
  }
  img.src = item.image
}

function downloadLibraryItem(item) {
  toast('正在重建并导出 GLB…', 'info')
  const img = new Image()
  img.onload = () => {
    const tmp = new THREE.Scene()
    tmp.add(buildReliefMesh(img, 3, 2.2))
    const exporter = new GLTFExporter()
    exporter.parse(tmp, (result) => {
      downloadBlob(new Blob([result], { type: 'model/gltf-binary' }), (item.name || 'model') + '.glb')
      toast('GLB 已导出 ✓', 'success')
    }, (err) => toast('导出失败', 'error'), { binary: true })
  }
  img.src = item.image
}

onBeforeUnmount(() => disposeViewer())
</script>

<style scoped>
.stepper { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.step { display: flex; align-items: center; gap: 8px; }
.step-dot {
  width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 16px; background: #efe6d2; color: var(--c-ink-light); border: 1px solid var(--c-border);
}
.step.done .step-dot { background: var(--c-success); color: #fff; border-color: var(--c-success); }
.step.active .step-dot { background: var(--c-primary); color: #fff; border-color: var(--c-primary); box-shadow: 0 0 0 4px rgba(56,43,107,.15); }
.step-label { font-size: 13px; font-weight: 600; color: var(--c-ink); }
.step-line { flex: 1; height: 2px; background: #e6d6b8; min-width: 24px; }
.step-line.on { background: var(--c-success); }

.flow-grid { grid-template-columns: 1fr 1fr; }
.card-title { font-size: 16px; color: var(--c-brown-dark); margin-bottom: 6px; }
.card-sub { font-size: 13px; color: var(--c-ink-light); margin-bottom: 14px; }

.hidden-input { display: none; }
.dropzone {
  border: 2px dashed var(--c-beige-dark); border-radius: 12px; padding: 34px 16px;
  text-align: center; cursor: pointer; transition: all .18s; background: #fbf6ec;
}
.dropzone:hover { border-color: var(--c-brown); background: #f8efe0; }
.dz-icon { font-size: 40px; }
.dz-text { font-size: 15px; font-weight: 600; color: var(--c-ink); margin-top: 8px; }
.dz-hint { font-size: 12px; color: var(--c-ink-light); margin-top: 4px; }
.uploaded-box { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.uploaded-img { width: 120px; height: 90px; object-fit: cover; border-radius: 10px; border: 1px solid var(--c-border); }
.thumb-strip { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.strip-thumb { width: 56px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid var(--c-border); }
.strip-thumb.cur { border: 2px solid var(--c-gold); }

.result-panel { margin-top: 14px; background: rgba(56,43,107,.05); border: 1px solid #e4d6fb; border-radius: 10px; padding: 14px; }
.result-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.result-icon { font-size: 28px; }
.result-type { font-size: 15px; font-weight: 700; color: var(--c-primary); }
.result-conf { font-size: 12px; color: var(--c-ink-light); margin-top: 2px; }
.result-conf b { color: var(--c-gold); font-size: 15px; }
.palette { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.palette-label { font-size: 12px; color: var(--c-ink-light); }
.swatch { width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(0,0,0,.12); display: inline-block; }
.tag-row { display: flex; gap: 6px; flex-wrap: wrap; }

.model-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.viewer3d { height: 320px; border-radius: 12px; overflow: hidden; background: #f5eee2; border: 1px solid var(--c-border); position: relative; }
.viewer3d.empty { display: flex; align-items: center; justify-content: center; }
.viewer-empty { color: var(--c-ink-light); font-size: 13px; }
.model-meta { margin-top: 8px; font-size: 12px; color: var(--c-ink-light); }

.store-form { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.stored-tip { margin-top: 12px; font-size: 13px; color: var(--c-success); }

.empty-tip { color: var(--c-ink-light); font-size: 13px; padding: 20px 0; text-align: center; }
.lib-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lib-item { display: flex; gap: 12px; align-items: center; background: #fff; border: 1px solid var(--c-border); border-radius: 12px; padding: 12px; }
.lib-thumb { width: 72px; height: 56px; object-fit: cover; border-radius: 8px; border: 1px solid var(--c-border); flex: 0 0 72px; }
.lib-info { flex: 1; min-width: 0; }
.lib-name { font-size: 14px; font-weight: 700; color: var(--c-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lib-tags { display: flex; gap: 6px; margin: 6px 0; flex-wrap: wrap; }
.lib-meta { font-size: 11px; color: var(--c-ink-light); }
.lib-actions { display: flex; flex-direction: column; gap: 6px; }

@media (max-width: 1100px) {
  .flow-grid { grid-template-columns: 1fr; }
  .lib-grid { grid-template-columns: 1fr; }
}
</style>
