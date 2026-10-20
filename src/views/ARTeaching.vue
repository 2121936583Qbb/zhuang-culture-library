<template>
  <div class="page">
    <div class="page-head">
      <h2 class="page-title">🥽 AR 教学数据</h2>
      <p class="page-sub">基于增强现实的文化教学资源与识别数据管理（演示）</p>
    </div>

    <div class="toolbar">
      <span class="badge badge-info">🥽 AR 引擎 v2.1</span>
      <span class="badge badge-success">📡 识别数据集就绪</span>
      <div class="spacer"></div>
      <button class="btn btn-primary btn-sm" @click="toast('上传新的识别目标图（模拟）', 'info')">➕ 上传目标图</button>
    </div>

    <div class="grid ar-grid">
      <div v-for="r in arMaterials" :key="r.id" class="zhuang-card ar-card">
        <div class="ar-cover" :style="r.thumbnail ? {} : { background: cover(r.category) }">
          <img v-if="r.thumbnail" :src="r.thumbnail" class="ar-thumb" alt="" />
          <span v-else class="ar-cover-icon">{{ catIcon(r.category) }}</span>
          <span class="badge ar-status" :class="r.status === '已发布' ? 'badge-success' : 'badge-warning'">{{ r.status }}</span>
        </div>
        <div class="card-body">
          <h3 class="ar-name">{{ r.name }}</h3>
          <p class="ar-subject">{{ r.subject }}</p>
          <div class="ar-meta">
            <div><label>AR 方式</label><b>{{ r.arType }}</b></div>
            <div><label>目标图</label><b>{{ r.target }}</b></div>
            <div><label>编号</label><b class="mono">{{ r.id }}</b></div>
          </div>
          <div class="ar-actions">
            <button class="btn btn-brown btn-sm" @click="preview(r)">🥽 AR 预览</button>
            <button class="btn btn-outline btn-sm" @click="toggleStatus(r)">{{ r.status === '已发布' ? '⏬ 内测' : '✅ 发布' }}</button>
            <button class="btn btn-outline btn-sm" @click="toast(`已同步「${r.name}」到教学端（模拟）`, 'success')">📤 同步</button>
          </div>
        </div>
      </div>
    </div>

    <!-- AR 预览弹窗 -->
    <Modal v-model="view.show" :title="`AR 预览 · ${view.data?.name || ''}`" width="640px">
      <div v-if="view.data" class="ar-body">
        <div class="ar-viewport">
          <div class="ar-grid"></div>
          <div class="ar-corners">
            <span class="ar-corner tl"></span><span class="ar-corner tr"></span>
            <span class="ar-corner bl"></span><span class="ar-corner br"></span>
          </div>
          <div class="ar-center">
            <div class="big">{{ catIcon(view.data.category) }}</div>
            <p>{{ view.data.name }}</p>
            <span class="ar-hint">{{ view.data.arType }} · 识别中…</span>
          </div>
        </div>
        <div class="ar-caption">📷 对准识别图即可触发 AR 内容叠加（模拟相机取景）</div>
      </div>
      <template #footer>
        <button class="btn btn-outline" @click="view.show = false">关闭</button>
        <button class="btn btn-primary" @click="toast('已触发 AR 内容叠加（模拟）', 'success')">✨ 触发叠加</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Modal from '../components/Modal.vue'
import { toast } from '../utils/toast.js'
import { catIcon } from '../data/mock.js'
import { arMaterials, updateArStatus } from '../data/store.js'

const view = reactive({ show: false, data: null })

const coverMap = {
  language: 'linear-gradient(135deg,#382b6b,#6a58a8)',
  pattern: 'linear-gradient(135deg,#865F50,#c8a254)',
  architecture: 'linear-gradient(135deg,#4d3b8a,#865F50)',
  song: 'linear-gradient(135deg,#b4533f,#EFD8B9)',
  craft: 'linear-gradient(135deg,#2a2052,#865F50)'
}
function cover(c) { return coverMap[c] || coverMap.pattern }

function preview(r) { view.data = r; view.show = true }

function toggleStatus(r) {
  const next = r.status === '已发布' ? '内测中' : '已发布'
  updateArStatus(r.id, next)
  toast(`AR 素材「${r.name}」已标记为「${next}」`, 'success')
}
</script>

<style scoped>
.ar-grid { grid-template-columns: repeat(3, 1fr); }
.ar-card { transition: all .18s; }
.ar-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.ar-cover { height: 120px; position: relative; display: flex; align-items: center; justify-content: center; }
.ar-cover-icon { font-size: 52px; filter: drop-shadow(0 4px 8px rgba(0,0,0,.3)); }
.ar-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ar-status { position: absolute; top: 12px; right: 12px; }
.ar-name { font-size: 16px; color: var(--c-primary); margin-bottom: 4px; }
.ar-subject { font-size: 13px; color: var(--c-brown); margin-bottom: 12px; }
.ar-meta { display: flex; gap: 16px; margin-bottom: 14px; }
.ar-meta div { display: flex; flex-direction: column; gap: 3px; }
.ar-meta label { font-size: 11px; color: var(--c-ink-light); }
.ar-meta b { font-size: 13px; color: var(--c-ink); }
.ar-actions { display: flex; gap: 10px; }

.ar-caption { text-align: center; font-size: 12px; color: var(--c-ink-light); margin-top: 12px; }
.ar-center p { font-size: 15px; font-weight: 600; margin: 8px 0 4px; }
.ar-hint { font-size: 12px; color: rgba(239,216,185,.85); }
</style>
