<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🧊 三维模型管理</h2>
      <p class="page-sub">壮族文化遗存的三维数字化重建与模型资产管理（演示）</p>
    </div>

    <div class="toolbar">
      <button
        v-for="c in [{key:'',label:'全部'}, ...categories]"
        :key="c.key"
        class="chip"
        :class="{ active: filterCat === c.key }"
        @click="filterCat = c.key"
      >{{ c.icon }} {{ c.label }}</button>
      <div class="spacer"></div>
      <span class="muted">共 {{ filtered.length }} 个模型</span>
    </div>

    <div class="grid model-grid">
      <div v-for="m in filtered" :key="m.id" class="zhuang-card model-card" @click="open(m)">
        <div class="model-preview" :style="m.thumbnail ? {} : { background: `linear-gradient(135deg, ${m.color[0]}, ${m.color[1]})` }">
          <img v-if="m.thumbnail" :src="m.thumbnail" class="model-thumb" alt="" />
          <span v-else class="model-preview-icon">{{ catIcon(m.category) }}</span>
          <span class="badge model-status" :class="m.status === '已发布' ? 'badge-success' : 'badge-warning'">{{ m.status }}</span>
        </div>
        <div class="card-body">
          <h3 class="model-name">{{ m.name }}</h3>
          <div class="model-meta">
            <span>{{ catLabel(m.category) }}</span>
            <span class="dot">·</span>
            <span>{{ m.format }}</span>
          </div>
          <div class="model-stats">
            <div><label>三角面</label><b>{{ m.faces }}</b></div>
            <div><label>大小</label><b>{{ m.size }}</b></div>
            <div><label>质量</label><b class="q">{{ m.quality }}%</b></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型查看弹窗 -->
    <Modal v-model="view.show" :title="view.data?.name || '三维模型预览'" width="620px">
      <div v-if="view.data" class="viewer">
        <div ref="viewerEl" class="viewer3d"></div>
        <p class="viewer-tip">🖱️ 左键拖动旋转 · 滚轮缩放 · 右键/中键平移</p>
        <div class="viewer-meta">
          <div><label>格式</label><b>{{ view.data.format }}</b></div>
          <div><label>三角面</label><b>{{ view.data.faces }}</b></div>
          <div><label>大小</label><b>{{ view.data.size }}</b></div>
          <div><label>重建质量</label><b class="q">{{ view.data.quality }}%</b></div>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="toggleAutoRotate">{{ autoRotate ? '⏸ 停止旋转' : '↻ 自动旋转' }}</button>
        <button class="btn btn-outline" @click="resetView">🔍 重置视角</button>
        <button class="btn btn-primary" @click="toggleStatus">{{ view.data.status === '已发布' ? '⏬ 标记为处理中' : '✅ 标记为已发布' }}</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { categories, catLabel, catIcon } from '../data/mock.js'
import { models, updateModelStatus } from '../data/store.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const filterCat = ref('')
const view = reactive({ show: false, data: null })
const autoRotate = ref(false)
const viewerEl = ref(null)

// three 运行时对象
let renderer = null
let scene = null
let camera = null
let controls = null
let rafId = null
let viewerToken = 0

const filtered = computed(() =>
  filterCat.value ? models.filter((m) => m.category === filterCat.value) : models
)

function open(m) {
  view.data = m
  view.show = true
}

function toggleStatus() {
  if (!view.data) return
  const next = view.data.status === '已发布' ? '处理中' : '已发布'
  updateModelStatus(view.data.id, next)
  toast(`模型已标记为「${next}」`, 'success')
}

// ---------- Three.js 查看器 ----------
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function buildGradientBox(color) {
  const [c1, c2] = color || ['#382b6b', '#865F50']
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 256, 256)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 2.2, 2.2),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.05 })
  )
}

function buildReliefMesh(img, width, height, seg = 64) {
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
    const gray = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255
    pos.setZ(i, gray * 0.5)
  }
  geometry.computeVertexNormals()

  const texture = new THREE.Texture(img)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0.05 })
  return new THREE.Mesh(geometry, material)
}

function fitToMesh(mesh) {
  const box = new THREE.Box3().setFromObject(mesh)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const fov = (camera.fov * Math.PI) / 180
  const dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.7
  controls.target.copy(center)
  camera.position.set(center.x, center.y, center.z + dist)
  camera.near = Math.max(dist / 200, 0.01)
  camera.far = dist * 200
  camera.updateProjectionMatrix()
  controls.update()
}

async function mountViewer(m) {
  disposeViewer()
  const token = viewerToken
  const container = viewerEl.value
  if (!container || !m) return

  const w = container.clientWidth || 560
  const h = container.clientHeight || 280

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5eee2)

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500)
  camera.position.set(0, 0, 5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.rotateSpeed = 0.8
  controls.zoomSpeed = 1.0
  controls.panSpeed = 0.8
  controls.autoRotate = autoRotate.value
  controls.autoRotateSpeed = 2.0

  scene.add(new THREE.AmbientLight(0xffffff, 0.95))
  const dir = new THREE.DirectionalLight(0xffffff, 1.5)
  dir.position.set(3, 4, 5)
  scene.add(dir)

  let mesh
  if (m.thumbnail) {
    const img = await loadImage(m.thumbnail)
    if (token !== viewerToken || !scene) return
    mesh = buildReliefMesh(img, 3, 2.2)
    mesh.rotation.x = -0.15
  } else {
    mesh = buildGradientBox(m.color)
  }
  if (token !== viewerToken || !scene) return
  scene.add(mesh)
  fitToMesh(mesh)

  const animate = () => {
    rafId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

function disposeViewer() {
  viewerToken += 1
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
        if (Array.isArray(o.material)) o.material.forEach((mm) => mm.dispose())
        else o.material.dispose()
      }
    })
    scene = null
  }
  camera = null
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  if (controls) controls.autoRotate = autoRotate.value
}

function resetView() {
  if (!scene) return
  let mesh = null
  scene.traverse((o) => { if (!mesh && o.isMesh) mesh = o })
  if (mesh) fitToMesh(mesh)
}

watch(() => view.show, (v) => {
  if (v) {
    nextTick(() => mountViewer(view.data))
  } else {
    disposeViewer()
  }
})

onBeforeUnmount(() => disposeViewer())
</script>

<style scoped>
.chip {
  padding: 7px 15px; border-radius: 20px; font-size: 13px;
  background: #fffdf8; border: 1px solid var(--c-border); color: var(--c-ink-light);
  transition: all .16s;
}
.chip:hover { border-color: var(--c-gold); color: var(--c-primary); }
.chip.active { background: var(--c-primary); color: #fff; border-color: var(--c-primary); }
.model-grid { grid-template-columns: repeat(3, 1fr); }
.model-card { cursor: pointer; transition: all .18s; }
.model-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.model-preview {
  height: 130px; position: relative; display: flex; align-items: center; justify-content: center;
}
.model-preview-icon { font-size: 52px; filter: drop-shadow(0 4px 8px rgba(0,0,0,.3)); }
.model-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.model-status { position: absolute; top: 12px; right: 12px; }
.model-name { font-size: 16px; color: var(--c-primary); margin-bottom: 6px; }
.model-meta { font-size: 13px; color: var(--c-ink-light); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.model-meta .dot { color: var(--c-beige-dark); }
.model-stats { display: flex; gap: 18px; }
.model-stats div { display: flex; flex-direction: column; gap: 3px; }
.model-stats label { font-size: 11px; color: var(--c-ink-light); }
.model-stats b { font-size: 13px; color: var(--c-ink); }
.model-stats .q { color: var(--c-success); }

.viewer { text-align: center; }
.viewer3d { height: 280px; border-radius: 12px; overflow: hidden; background: #f5eee2; border: 1px solid var(--c-border); position: relative; }
.viewer3d canvas { display: block; }
.viewer-tip { font-size: 12px; color: var(--c-ink-light); margin: 8px 0 16px; }
.viewer-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.viewer-meta div { background: rgba(56,43,107,.05); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.viewer-meta label { font-size: 12px; color: var(--c-ink-light); }
.viewer-meta b { font-size: 15px; color: var(--c-primary); }
.viewer-meta .q { color: var(--c-success); }
</style>
